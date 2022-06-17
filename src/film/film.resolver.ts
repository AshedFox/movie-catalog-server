import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FilmModel } from './entities/film.model';
import { CreateFilmInput } from './dto/create-film.input';
import { GetFilmsArgs } from './dto/get-films.args';
import { FilmService } from './film.service';
import { UpdateFilmInput } from './dto/update-film.input';
import { PaginatedFilms } from './dto/paginated-films.result';
import { ParseUUIDPipe } from '@nestjs/common';
import { GraphQLResolveInfo } from 'graphql';

@Resolver(FilmModel)
export class FilmResolver {
  constructor(private readonly filmService: FilmService) {}

  @Query(() => PaginatedFilms)
  async getFilms(
    @Args() { searchTitle, take, skip }: GetFilmsArgs,
    @Info() info: GraphQLResolveInfo,
  ) {
    info.returnType;
    return this.filmService.readAll(searchTitle, take, skip);
  }

  @Query(() => FilmModel, { nullable: true })
  async getFilm(@Args('id', ParseUUIDPipe) id: string) {
    return this.filmService.readOne(id);
  }

  @Mutation(() => FilmModel)
  async createFilm(@Args('input') input: CreateFilmInput) {
    return this.filmService.create(input);
  }

  @Mutation(() => FilmModel)
  async updateFilm(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('input') input: UpdateFilmInput,
  ) {
    return this.filmService.update(id, input);
  }

  @Mutation(() => Boolean)
  async deleteFilm(@Args('id', ParseUUIDPipe) id: string) {
    return this.filmService.delete(id);
  }
}
