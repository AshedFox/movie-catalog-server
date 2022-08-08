import {
  Args,
  Context,
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
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { PersonEntity } from '../person/entities/person.entity';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '../utils/enums/role.enum';

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
  getMoviesPersons(
    @Args() { movieId, personId, type, take, skip }: GetMoviesPersonsArgs,
  ) {
    return this.moviePersonService.readMany(
      take,
      skip,
      movieId,
      personId,
      type,
    );
  }

  @Query(() => MoviePersonEntity, { nullable: true })
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
  @Mutation(() => Boolean)
  deleteMoviePerson(@Args('id', { type: () => Int }) id: number) {
    return this.moviePersonService.delete(id);
  }

  @ResolveField(() => MovieEntity)
  movie(
    @Parent() moviePerson: MoviePersonEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.movieLoader.load(moviePerson.movieId);
  }

  @ResolveField(() => PersonEntity)
  person(
    @Parent() moviePerson: MoviePersonEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.personLoader.load(moviePerson.personId);
  }
}
