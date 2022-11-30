import { ArgsType } from '@nestjs/graphql';
import { GqlArgs } from '@common/args';
import { EpisodeEntity } from '../entities/episode.entity';

@ArgsType()
export class GetEpisodesArgs extends GqlArgs(EpisodeEntity) {}
