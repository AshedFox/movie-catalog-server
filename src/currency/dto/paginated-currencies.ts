import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/pagination/offset';
import { CurrencyEntity } from '../entities/currency.entity';

@ObjectType()
export class PaginatedCurrencies extends Paginated(CurrencyEntity) {}
