import { Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';

@Injectable()
export class OTPService {
  async generateOTP() {
    return randomInt(1_0_0_0_0_0, 9_9_9_9_9_9).toString();
  }
}
