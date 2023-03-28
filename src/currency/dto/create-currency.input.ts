import { Field, InputType } from '@nestjs/graphql';
import { Length } from 'class-validator';
import { CurrencyEntity } from '../entities/currency.entity';

@InputType()
export class CreateCurrencyInput implements Partial<CurrencyEntity> {
  @Field()
  @Length(3, 3)
  id: string;

  @Field()
  @Length(1, 3)
  symbol: string;

  @Field()
  @Length(2, 255)
  name: string;
}
