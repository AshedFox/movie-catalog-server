import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../utils/paginated.helper';
import { SeasonEntity } from '../entities/season.entity';

@ObjectType()
export class PaginatedSeasons extends Paginated(SeasonEntity) {}
