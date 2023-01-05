import { Field, InputType } from '@nestjs/graphql';
import { PersonEntity } from '../entities/person.entity';
import { IsOptional, Length } from 'class-validator';

@InputType()
export class CreatePersonInput implements Partial<PersonEntity> {
  @Field(() => String, { nullable: true })
  @IsOptional()
  imageId?: string;

  @Field()
  @Length(1, 255)
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  countryId?: string;
}
