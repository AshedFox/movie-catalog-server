import { Field, InputType, Int } from '@nestjs/graphql';
import { CountryEntity } from '../entities/country.entity';
import { Length } from 'class-validator';
import { Column } from 'typeorm';

@InputType()
export class CreateCountryInput implements Partial<CountryEntity> {
  @Field()
  @Length(2, 2)
  id: string;

  @Field()
  @Length(2, 255)
  name: string;

  @Field(() => Int)
  @Column()
  currencyId: number;
}
