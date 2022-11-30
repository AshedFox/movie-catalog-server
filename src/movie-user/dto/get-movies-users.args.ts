import { ArgsType } from '@nestjs/graphql';
import { GqlArgs } from '@common/args';
import { MovieUserEntity } from '../entities/movie-user.entity';

@ArgsType()
export class GetMoviesUsersArgs extends GqlArgs(MovieUserEntity) {}
