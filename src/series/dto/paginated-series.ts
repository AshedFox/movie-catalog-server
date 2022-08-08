import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../utils/paginated.helper';
import { SeriesEntity } from '../entities/series.entity';

@ObjectType()
export class PaginatedSeries extends Paginated(SeriesEntity) {}
