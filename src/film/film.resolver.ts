import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { FilmModel } from './entities/film.model';
import { CreateFilmInput } from './dto/create-film.input';
import { GetFilmsArgs } from './dto/get-films.args';
import { FilmService } from './film.service';
import { UpdateFilmInput } from './dto/update-film.input';
import { PaginatedFilms } from './dto/paginated-films.result';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '../user/entities/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { VideoModel } from '../video/entities/video.model';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { FilmPersonModel } from '../film-person/entities/film-person.model';
import { GenreModel } from '../genre/entities/genre.model';
import { StudioModel } from '../studio/entities/studio.model';

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

  @Mutation(() => Boolean)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  deleteFilm(@Args('id', ParseUUIDPipe) id: string) {
    return this.filmService.delete(id);
  }

  @ResolveField(() => VideoModel)
  video(@Parent() film: FilmModel, @Context('loaders') loaders: IDataLoaders) {
    return film.videoId ? loaders.videoLoader.load(film.videoId) : undefined;
  }

  @ResolveField(() => [FilmPersonModel])
  filmPersons(
    @Parent() film: FilmModel,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.filmPersonsByFilmLoader.load(film.id);
  }

  @ResolveField(() => [GenreModel])
  genres(@Parent() film: FilmModel, @Context('loaders') loaders: IDataLoaders) {
    return loaders.genresByFilmLoader.load(film.id);
  }

  @ResolveField(() => [StudioModel])
  studios(
    @Parent() film: FilmModel,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.studiosByFilmLoader.load(film.id);
  }
}
