import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../shared/paginated';
import { SeriesPersonModel } from '../entities/series-person.model';

@ObjectType()
export class PaginatedSeriesPersons extends Paginated(SeriesPersonModel) {}
