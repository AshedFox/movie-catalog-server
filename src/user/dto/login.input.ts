import { Field, InputType } from '@nestjs/graphql';
import { UserModel } from '../entities/user.model';
import { IsEmail, IsHash } from 'class-validator';

@InputType()
export class LoginInput implements Partial<UserModel> {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsHash('sha512')
  password!: string;
}
