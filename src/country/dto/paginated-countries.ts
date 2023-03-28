import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/pagination/offset';
import { CountryEntity } from '../entities/country.entity';

@ObjectType()
export class PaginatedCountries extends Paginated(CountryEntity) {}
