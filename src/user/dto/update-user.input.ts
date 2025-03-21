import { Field, InputType } from '@nestjs/graphql';
import { UserEntity } from '../entities/user.entity';
import { IsEmail, IsOptional, IsUUID, Length } from 'class-validator';

@InputType()
export class UpdateUserInput implements Partial<UserEntity> {
  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
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
