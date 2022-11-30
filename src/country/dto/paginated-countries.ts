import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/pagination';
import { CountryEntity } from '../entities/country.entity';

@ObjectType()
export class PaginatedCountries extends Paginated(CountryEntity) {}
