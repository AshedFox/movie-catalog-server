import { InputType } from '@nestjs/graphql';
import { CreateCurrencyInput } from './create-currency.input';

@InputType()
export class UpdateCurrencyInput extends CreateCurrencyInput {}
