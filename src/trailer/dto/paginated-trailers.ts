import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/pagination/offset';
import { TrailerEntity } from '../entities/trailer.entity';

@ObjectType()
export class PaginatedTrailers extends Paginated(TrailerEntity) {}
