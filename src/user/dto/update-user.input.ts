import { Field, InputType, Int } from '@nestjs/graphql';
import { UserModel } from '../entities/user.model';
import { IsEmail, IsOptional } from 'class-validator';

@InputType()
export class UpdateUserInput implements Partial<UserModel> {
  @Field()
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field(() => Int)
  @IsOptional()
  countryId?: number;
}
