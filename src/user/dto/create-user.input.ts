import { Field, InputType } from '@nestjs/graphql';
import { UserEntity } from '../entities/user.entity';
import { IsEmail, Length } from 'class-validator';

@InputType()
export class CreateUserInput implements Partial<UserEntity> {
  @Field()
  customerId: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;

  @Field()
  @Length(2, 255)
  name: string;
}
