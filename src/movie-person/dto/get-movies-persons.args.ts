import { ArgsType } from '@nestjs/graphql';
import { MoviePersonEntity } from '../entities/movie-person.entity';
import { GqlArgs } from '../../common/args';

@ArgsType()
export class GetMoviesPersonsArgs extends GqlArgs(MoviePersonEntity) {}
