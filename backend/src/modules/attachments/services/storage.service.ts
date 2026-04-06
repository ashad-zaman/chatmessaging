import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '@common/logger/logger';

export interface StorageOptions {
  filename: string;
  originalName: string;
  mimeType: string;
  buffer: Buffer;
}

export interface StoredFile {
  filename: string;
  url: string;
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger('StorageService');
  private readonly uploadDir: string;

  constructor(private readonly configService: ConfigService) {
    this.uploadDir = this.configService.get('UPLOAD_DIR', './uploads');
    this.ensureUploadDirectory();
  }

  private async ensureUploadDirectory(): Promise<void> {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(options: StorageOptions): Promise<StoredFile> {
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    
    if (isProduction && this.configService.get('s3.bucket')) {
      return this.uploadToS3(options);
    }
    
    return this.uploadToLocal(options);
  }

  async uploadToLocal(options: StorageOptions): Promise<StoredFile> {
    const ext = path.extname(options.originalName);
    const filename = `${uuidv4()}${ext}`;
    const filepath = path.join(this.uploadDir, filename);

    await fs.writeFile(filepath, options.buffer);

    const url = `/uploads/${filename}`;
    this.logger.log(`File uploaded locally: ${filename}`);

    return { filename, url };
  }

  async uploadToS3(options: StorageOptions): Promise<StoredFile> {
    const bucket = this.configService.get('s3.bucket');
    const region = this.configService.get('s3.region');
    const ext = path.extname(options.originalName);
    const filename = `attachments/${uuidv4()}${ext}`;

    this.logger.log(`S3 upload not implemented, using local storage for: ${filename}`);

    return this.uploadToLocal(options);
  }

  async deleteFile(filename: string): Promise<void> {
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    
    if (isProduction && this.configService.get('s3.bucket')) {
      this.logger.log(`S3 delete not implemented for: ${filename}`);
      return;
    }

    const filepath = path.join(this.uploadDir, filename);
    try {
      await fs.unlink(filepath);
      this.logger.log(`File deleted locally: ${filename}`);
    } catch (error) {
      this.logger.warn(`Failed to delete file: ${filename}`, error);
    }
  }

  async getFileUrl(filename: string): Promise<string> {
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    
    if (isProduction && this.configService.get('s3.bucket')) {
      return `https://${this.configService.get('s3.bucket')}.s3.${this.configService.get('s3.region')}.amazonaws.com/${filename}`;
    }

    return `/uploads/${filename}`;
  }
}
