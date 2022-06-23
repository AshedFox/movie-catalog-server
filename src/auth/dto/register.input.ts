import { UserModel } from '../../user/entities/user.model';
import { IsEmail, IsHash } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RegisterInput implements Partial<UserModel> {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsHash('sha512')
  password!: string;
}
