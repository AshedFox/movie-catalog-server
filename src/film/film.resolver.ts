import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FilmModel } from './entities/film.model';
import { CreateFilmInput } from './dto/create-film.input';
import { GetFilmsArgs } from './dto/get-films.args';
import { FilmService } from './film.service';
import { UpdateFilmInput } from './dto/update-film.input';
import { PaginatedFilms } from './dto/paginated-films.result';
import { ParseArrayPipe, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '../shared/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';

@Resolver(FilmModel)
export class FilmResolver {
  constructor(private readonly filmService: FilmService) {}

  @Mutation(() => FilmModel)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  createFilm(@Args('input') input: CreateFilmInput) {
    return this.filmService.create(input);
  }

  @Query(() => PaginatedFilms)
  getFilms(@Args() { searchTitle, take, skip }: GetFilmsArgs) {
    return this.filmService.readAll(searchTitle, take, skip);
  }

  @Query(() => FilmModel, { nullable: true })
  getFilm(@Args('id', ParseUUIDPipe) id: string) {
    return this.filmService.readOne(id);
  }

  @Mutation(() => FilmModel)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  updateFilm(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('input') input: UpdateFilmInput,
  ) {
    return this.filmService.update(id, input);
  }

  @Mutation(() => FilmModel)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  addGenresToFilm(
    @Args('id', ParseUUIDPipe) id: string,
    @Args({ name: 'genresIds', type: () => [String] }, ParseArrayPipe)
    genresIds: string[],
  ) {
    return this.filmService.addGenresToFilm(id, genresIds);
  }

  @Mutation(() => FilmModel)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  deleteGenresFromFilm(
    @Args('id', ParseUUIDPipe) id: string,
    @Args({ name: 'genresIds', type: () => [String] }, ParseArrayPipe)
    genresIds: string[],
  ) {
    return this.filmService.deleteGenresFromFilm(id, genresIds);
  }

  @Mutation(() => FilmModel)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  addStudiosToFilm(
    @Args('id', ParseUUIDPipe) id: string,
    @Args({ name: 'studiosIds', type: () => [Number] }, ParseArrayPipe)
    studiosIds: number[],
  ) {
    return this.filmService.addStudiosToFilm(id, studiosIds);
  }

  @Mutation(() => FilmModel)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  deleteStudiosFromFilm(
    @Args('id', ParseUUIDPipe) id: string,
    @Args({ name: 'studiosIds', type: () => [Number] }, ParseArrayPipe)
    studiosIds: number[],
  ) {
    return this.filmService.deleteStudiosFromFilm(id, studiosIds);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  deleteFilm(@Args('id', ParseUUIDPipe) id: string) {
    return this.filmService.delete(id);
  }
}
