import { ArgsType } from '@nestjs/graphql';
import { GqlArgs } from '@common/args';
import { MovieEntity } from '../entities/movie.entity';

@ArgsType()
export class GetMoviesArgs extends GqlArgs(MovieEntity) {}
