import { ArgsType } from '@nestjs/graphql';
import { GqlArgs } from '@common/args';
import { MovieEntity } from '../entities/movie.entity';

@ArgsType()
export class GetMoviesOffsetArgs extends GqlArgs(MovieEntity) {}

@ArgsType()
export class GetMoviesRelayArgs extends GqlArgs(MovieEntity, 'relay') {}
