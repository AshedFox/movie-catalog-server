import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../shared/paginated';
import { SeriesModel } from '../entities/series.model';

@ObjectType()
export class PaginatedSeries extends Paginated(SeriesModel) {}
