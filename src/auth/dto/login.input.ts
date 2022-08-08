import { UserEntity } from '../../user/entities/user.entity';
import { IsEmail, IsHash } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginInput implements Partial<UserEntity> {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsHash('sha512')
  password: string;
}
