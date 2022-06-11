import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../shared/paginated';
import { SeasonModel } from '../entities/season.model';

@ObjectType()
export class PaginatedSeasons extends Paginated(SeasonModel) {}
