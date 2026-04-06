import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from '@modules/auth/controllers/auth.controller';
import { AuthService } from '@modules/auth/services/auth.service';
import { JwtAccessTokenStrategy } from '@modules/auth/strategies/jwt-access-token.strategy';
import { User } from '@domain/entities/user.entity';
import { RefreshToken } from '@domain/entities/refresh-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken]),
    PassportModule.register({ defaultStrategy: 'jwt-access' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.secret', 'your-super-secret-jwt-key-change-in-production'),
        signOptions: {
          expiresIn: configService.get('jwt.accessTokenExpiresIn', '15m'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessTokenStrategy],
  exports: [AuthService],
})
export class AuthModule {}
