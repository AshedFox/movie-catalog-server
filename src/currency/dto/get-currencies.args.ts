import { ArgsType } from '@nestjs/graphql';
import { GqlArgs } from '@common/args';
import { CurrencyEntity } from '../entities/currency.entity';

@ArgsType()
export class GetCurrenciesArgs extends GqlArgs(CurrencyEntity) {}
