import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserGoogle } from './auth.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessTokenStrategy } from './jwtAccessToken.strategy';
import { MailModule } from '../mail/mail.module';
import { JwtRefreshTokenStrategy } from './jwtRefreshToken.strategy';
import { ResetPassword } from '../mail/reset_password.entity';
import { PassportModule } from '@nestjs/passport';
import { jwt_config } from 'src/config/jwt.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ResetPassword, UserGoogle]),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.register({
      // secret: jwt_config.secret,
      signOptions: {
        expiresIn: jwt_config.expired,
      },
    }),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessTokenStrategy, JwtRefreshTokenStrategy],
})
export class AuthModule {}
