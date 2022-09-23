import { ObjectType } from '@nestjs/graphql';
import { EpisodeEntity } from '../entities/episode.entity';
import { Paginated } from '../../common/pagination';

@ObjectType()
export class PaginatedEpisodes extends Paginated(EpisodeEntity) {}
