import { Field, InputType } from '@nestjs/graphql';
import { CountryEntity } from '../entities/country.entity';
import { MinLength } from 'class-validator';

@InputType()
export class CreateCountryInput implements Partial<CountryEntity> {
  @Field()
  @MinLength(2)
  name: string;

  @Field()
  @MinLength(1)
  code: string;
}
