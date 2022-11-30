import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/pagination';
import { SeasonEntity } from '../entities/season.entity';

@ObjectType()
export class PaginatedSeasons extends Paginated(SeasonEntity) {}
