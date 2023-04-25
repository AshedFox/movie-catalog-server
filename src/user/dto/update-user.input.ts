import { Field, InputType } from '@nestjs/graphql';
import { UserEntity } from '../entities/user.entity';
import { IsEmail, IsOptional, Length } from 'class-validator';

@InputType()
export class UpdateUserInput implements Partial<UserEntity> {
  @Field()
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field()
  @Length(2, 255)
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  countryId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  avatarId?: string;
}
