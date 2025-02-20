import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsHash, Length } from 'class-validator';

@InputType()
export class SignUpInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;

  @Field()
  passwordRepeat: string;

  @Field()
  @Length(3, 255)
  name: string;
}
