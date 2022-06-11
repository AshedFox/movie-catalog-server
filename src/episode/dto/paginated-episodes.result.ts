import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../shared/paginated';
import { EpisodeModel } from '../entities/episode.model';

@ObjectType()
export class PaginatedEpisodes extends Paginated(EpisodeModel) {}
