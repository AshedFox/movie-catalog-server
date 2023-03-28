import { Field, InputType } from '@nestjs/graphql';
import { CountryEntity } from '../entities/country.entity';
import { Length } from 'class-validator';

@InputType()
export class CreateCountryInput implements Partial<CountryEntity> {
  @Field()
  @Length(2, 2)
  id: string;

  @Field()
  @Length(2, 255)
  name: string;

  @Field()
  @Length(3, 3)
  currencyId: string;

  @Field()
  @Length(3, 3)
  languageId: string;
}
