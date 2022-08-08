import { Field, InputType, Int } from '@nestjs/graphql';
import { PersonEntity } from '../entities/person.entity';
import { IsOptional, Length } from 'class-validator';

@InputType()
export class CreatePersonInput implements Partial<PersonEntity> {
  @Field()
  @Length(1, 200)
  name: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  countryId?: number;
}
