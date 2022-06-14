import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalAuthStrategy } from './strategies/local-auth.strategy';
import { AuthController } from './auth.controller';
import { JwtAuthStrategy } from './strategies/jwt-auth.strategy';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    UserModule,
    EmailModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.SECRET,
        signOptions: {
          expiresIn: '1h',
        },
      }),
    }),
  ],
  providers: [AuthService, LocalAuthStrategy, JwtAuthStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
