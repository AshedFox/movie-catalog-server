import { Field, InputType } from '@nestjs/graphql';
import { CountryModel } from '../entities/country.model';
import { MinLength } from 'class-validator';

@InputType()
export class CreateCountryInput implements Partial<CountryModel> {
  @Field()
  @MinLength(2)
  name!: string;
}
