import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/pagination/offset';
import { SeriesEntity } from '../entities/series.entity';

@ObjectType()
export class PaginatedSeries extends Paginated(SeriesEntity) {}
