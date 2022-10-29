import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../common/pagination';
import { TrailerEntity } from '../entities/trailer.entity';

@ObjectType()
export class PaginatedTrailers extends Paginated(TrailerEntity) {}
