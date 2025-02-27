import { Module } from '@nestjs/common';
import { OTPService } from './otp.service';

@Module({
  providers: [OTPService],
  exports: [OTPService],
})
export class OTPModule {}
