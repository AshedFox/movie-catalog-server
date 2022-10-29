import { ArgsType } from '@nestjs/graphql';
import { MovieImageEntity } from '../entities/movie-image.entity';
import { GqlArgs } from '../../common/args';

@ArgsType()
export class GetMoviesImagesArgs extends GqlArgs(MovieImageEntity) {}
