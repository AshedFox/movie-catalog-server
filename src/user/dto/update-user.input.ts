import { Field, InputType, Int } from '@nestjs/graphql';
import { UserEntity } from '../entities/user.entity';
import { IsEmail, IsOptional } from 'class-validator';

@InputType()
export class UpdateUserInput implements Partial<UserEntity> {
  @Field()
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  countryId?: number;

  @Field({ nullable: true })
  @IsOptional()
  avatarId?: string;
}
