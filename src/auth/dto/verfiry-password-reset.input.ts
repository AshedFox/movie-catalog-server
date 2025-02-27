import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNumberString, Length } from 'class-validator';

@InputType()
export class VerifyPasswordResetInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNumberString()
  @Length(6, 6)
  otp: string;
}
