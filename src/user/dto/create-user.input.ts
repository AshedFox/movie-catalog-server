import { Field, InputType } from '@nestjs/graphql';
import { UserEntity } from '../entities/user.entity';
import { IsEmail, IsHash, Length } from 'class-validator';

@InputType()
export class CreateUserInput implements Partial<UserEntity> {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsHash('sha512')
  password: string;

  @Field()
  @Length(2, 255)
  name: string;
}
