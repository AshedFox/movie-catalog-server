import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/pagination';
import { CurrencyEntity } from '../entities/currency.entity';

@ObjectType()
export class PaginatedCurrencies extends Paginated(CurrencyEntity) {}
