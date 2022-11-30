import { Field, InputType, Int } from '@nestjs/graphql';
import { CountryEntity } from '../entities/country.entity';
import { Length, MinLength } from 'class-validator';
import { Column } from 'typeorm';

@InputType()
export class CreateCountryInput implements Partial<CountryEntity> {
  @Field()
  @MinLength(2)
  name: string;

  @Field()
  @Length(2, 2)
  code: string;

  @Field(() => Int)
  @Column()
  currencyId: number;
}
