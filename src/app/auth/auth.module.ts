import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessTokenStrategy } from './jwtAccessToken.strategy';
import { MailModule } from '../mail/mail.module';
// import { ResetPassword } from './reset_password.entity';
import { JwtRefreshTokenStrategy } from './jwtRefreshToken.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      // ResetPassword
    ]),
    JwtModule.register({
      // global: true,
      // signOptions: {
      //   algoritma: 'HS256',
      // },
    }),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessTokenStrategy, JwtRefreshTokenStrategy],
})
export class AuthModule {}
