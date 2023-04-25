import { Field, InputType } from '@nestjs/graphql';
import { PersonEntity } from '../entities/person.entity';
import { IsOptional, IsUUID, Length } from 'class-validator';

@InputType()
export class CreatePersonInput implements Partial<PersonEntity> {
  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  imageId?: string;

  @Field()
  @Length(1, 255)
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  countryId?: string;
}
