import { UserEntity } from '../../user/entities/user.entity';
import { IsEmail } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginInput implements Partial<UserEntity> {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;
}
