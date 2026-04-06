import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '@domain/entities/user.entity';
import { RefreshToken } from '@domain/entities/refresh-token.entity';
import { RegisterDto } from '@modules/auth/dto/register.dto';
import { LoginDto } from '@modules/auth/dto/login.dto';
import { TokensResponseDto } from '@modules/auth/dto/tokens-response.dto';
import { JwtPayload } from '@modules/auth/strategies/jwt.strategy';
import { Logger } from '@common/logger/logger';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');
  private readonly SALT_ROUNDS = 10;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<TokensResponseDto> {
    const { email, username, password, displayName } = registerDto;

    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      throw new ConflictException('User with this email or username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

    const user = this.userRepository.create({
      email,
      username,
      password: hashedPassword,
      displayName: displayName || username,
      role: UserRole.USER,
      isEmailVerified: false,
    });

    await this.userRepository.save(user);
    this.logger.log(`User registered: ${user.id}`);

    return this.generateTokens(user, registerDto.deviceInfo);
  }

  async login(loginDto: LoginDto): Promise<TokensResponseDto> {
    const { email, password, deviceInfo } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(`User logged in: ${user.id}`);
    return this.generateTokens(user, deviceInfo);
  }

  async refreshTokens(refreshToken: string): Promise<TokensResponseDto> {
    const storedToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
      relations: ['user'],
    });

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (storedToken.isRevoked) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    if (storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token has expired');
    }

    const user = storedToken.user;
    await this.revokeToken(storedToken.id);

    return this.generateTokens(user, storedToken.deviceInfo);
  }

  async logout(userId: string, refreshToken?: string): Promise<void> {
    if (refreshToken) {
      const token = await this.refreshTokenRepository.findOne({
        where: { token: refreshToken, userId },
      });
      if (token) {
        await this.revokeToken(token.id);
      }
    } else {
      await this.refreshTokenRepository.update(
        { userId, isRevoked: false },
        { isRevoked: true },
      );
    }
    this.logger.log(`User logged out: ${userId}`);
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async revokeToken(tokenId: string): Promise<void> {
    await this.refreshTokenRepository.update(tokenId, { isRevoked: true });
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { userId, isRevoked: false },
      { isRevoked: true },
    );
  }

  private async generateTokens(user: User, deviceInfo?: string): Promise<TokensResponseDto> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '7d',
      }),
    ]);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const refreshTokenEntity = this.refreshTokenRepository.create({
      token: refreshToken,
      expiresAt,
      userId: user.id,
      deviceInfo,
    });

    await this.refreshTokenRepository.save(refreshTokenEntity);

    return {
      accessToken,
      refreshToken,
    };
  }
}
