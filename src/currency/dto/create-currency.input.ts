import { Field, InputType } from '@nestjs/graphql';
import { Length } from 'class-validator';
import { CurrencyEntity } from '../entities/currency.entity';

@InputType()
export class CreateCurrencyInput implements Partial<CurrencyEntity> {
  @Field()
  @Length(3, 3)
  symbol: string;

  @Field()
  @Length(3, 3)
  code: string;
}
