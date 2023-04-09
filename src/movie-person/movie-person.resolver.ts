import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { MoviePersonService } from './movie-person.service';
import { CreateMoviePersonInput } from './dto/create-movie-person.input';
import { UpdateMoviePersonInput } from './dto/update-movie-person.input';
import { MoviePersonEntity } from './entities/movie-person.entity';
import { UseGuards } from '@nestjs/common';
import { GetMoviesPersonsArgs } from './dto/get-movies-persons.args';
import { PaginatedMoviesPersons } from './dto/paginated-movies-persons';
import { MovieEntity } from '../movie/entities/movie.entity';
import { PersonEntity } from '../person/entities/person.entity';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '@utils/enums';
import { MoviePersonTypeEntity } from '../movie-person-type/entities/movie-person-type.entity';
import { LoadersFactory } from '../dataloader/decorators/loaders-factory.decorator';
import { DataLoaderFactory } from '../dataloader/data-loader.factory';

@Resolver(MoviePersonEntity)
export class MoviePersonResolver {
  constructor(private readonly moviePersonService: MoviePersonService) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => MoviePersonEntity)
  createMoviePerson(
    @Args('input') createMoviePersonInput: CreateMoviePersonInput,
  ) {
    return this.moviePersonService.create(createMoviePersonInput);
  }

  @Query(() => PaginatedMoviesPersons)
  async getMoviesPersons(
    @Args() { sort, filter, ...pagination }: GetMoviesPersonsArgs,
  ) {
    const [data, count] = await Promise.all([
      this.moviePersonService.readMany(pagination, sort, filter),
      this.moviePersonService.count(filter),
    ]);

    const { limit, offset } = pagination;

    return {
      nodes: data,
      pageInfo: {
        totalCount: count,
        hasNextPage: count > limit + offset,
        hasPreviousPage: offset > 0,
      },
    };
  }

  @Query(() => MoviePersonEntity)
  getMoviePerson(@Args('id', { type: () => Int }) id: number) {
    return this.moviePersonService.readOne(id);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => MoviePersonEntity)
  updateMoviePerson(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') updateMoviePersonInput: UpdateMoviePersonInput,
  ) {
    return this.moviePersonService.update(id, updateMoviePersonInput);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => MoviePersonEntity)
  deleteMoviePerson(@Args('id', { type: () => Int }) id: number) {
    return this.moviePersonService.delete(id);
  }

  @ResolveField(() => MovieEntity)
  movie(
    @Parent() moviePerson: MoviePersonEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(MovieEntity, 'id')
      .load(moviePerson.movieId);
  }

  @ResolveField(() => PersonEntity)
  person(
    @Parent() moviePerson: MoviePersonEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(PersonEntity, 'id')
      .load(moviePerson.personId);
  }

  @ResolveField(() => MoviePersonTypeEntity)
  type(
    @Parent() moviePerson: MoviePersonEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(MoviePersonTypeEntity, 'id')
      .load(moviePerson.typeId);
  }
}
