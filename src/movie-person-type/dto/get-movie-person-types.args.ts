import { ArgsType } from '@nestjs/graphql';
import { GqlArgs } from '@common/args';
import { MoviePersonTypeEntity } from '../entities/movie-person-type.entity';

@ArgsType()
export class GetMoviePersonTypesArgs extends GqlArgs(MoviePersonTypeEntity) {}
