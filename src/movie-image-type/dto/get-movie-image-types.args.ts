import { GqlArgs } from '@common/args';
import { MovieImageTypeEntity } from '../entities/movie-image-type.entity';
import { ArgsType } from '@nestjs/graphql';

@ArgsType()
export class GetMovieImageTypesArgs extends GqlArgs(MovieImageTypeEntity) {}
