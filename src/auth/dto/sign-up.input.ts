import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, Matches } from 'class-validator';

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
  @Matches(/^[a-zA-Z]{2,}(?: [a-zA-Z]+){1,2}$/)
  name: string;
}
