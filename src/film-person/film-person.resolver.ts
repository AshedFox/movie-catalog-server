import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FilmPersonService } from './film-person.service';
import { CreateFilmPersonInput } from './dto/create-film-person.input';
import { UpdateFilmPersonInput } from './dto/update-film-person.input';
import { FilmPersonModel } from './entities/film-person.model';
import { ParseIntPipe } from '@nestjs/common';
import { GetFilmsPersonsArgs } from './dto/get-films-persons.args';
import { PaginatedFilmsPersons } from './dto/paginated-films-persons.result';

@Resolver(FilmPersonModel)
export class FilmPersonResolver {
  constructor(private readonly filmPersonService: FilmPersonService) {}

  @Mutation(() => FilmPersonModel)
  createFilmPerson(
    @Args('input') createFilmPersonInput: CreateFilmPersonInput,
  ) {
    return this.filmPersonService.create(createFilmPersonInput);
  }

  @Query(() => PaginatedFilmsPersons)
  getFilmsPersons(
    @Args() { filmId, personId, type, take, skip }: GetFilmsPersonsArgs,
  ) {
    return this.filmPersonService.readAll(take, skip, filmId, personId, type);
  }

  @Query(() => FilmPersonModel, { nullable: true })
  getFilmPerson(@Args('id', ParseIntPipe) id: number) {
    return this.filmPersonService.readOne(id);
  }

  @Mutation(() => FilmPersonModel)
  updateFilmPerson(
    @Args('id', ParseIntPipe) id: number,
    @Args('input') updateFilmPersonInput: UpdateFilmPersonInput,
  ) {
    return this.filmPersonService.update(id, updateFilmPersonInput);
  }

  @Mutation(() => Boolean)
  deleteFilmPerson(@Args('id', ParseIntPipe) id: number) {
    return this.filmPersonService.delete(id);
  }
}
