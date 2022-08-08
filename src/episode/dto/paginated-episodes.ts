import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../utils/paginated.helper';
import { EpisodeEntity } from '../entities/episode.entity';

@ObjectType()
export class PaginatedEpisodes extends Paginated(EpisodeEntity) {}
