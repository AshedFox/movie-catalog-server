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
import { FilmPersonService } from './film-person.service';
import { CreateFilmPersonInput } from './dto/create-film-person.input';
import { UpdateFilmPersonInput } from './dto/update-film-person.input';
import { FilmPersonModel } from './entities/film-person.model';
import { UseGuards } from '@nestjs/common';
import { GetFilmsPersonsArgs } from './dto/get-films-persons.args';
import { PaginatedFilmsPersons } from './dto/paginated-films-persons.result';
import { FilmModel } from '../film/entities/film.model';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { PersonModel } from '../person/entities/person.model';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '../user/entities/role.enum';

@Resolver(FilmPersonModel)
export class FilmPersonResolver {
  constructor(private readonly filmPersonService: FilmPersonService) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
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
  getFilmPerson(@Args('id', { type: () => Int }) id: number) {
    return this.filmPersonService.readOne(id);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => FilmPersonModel)
  updateFilmPerson(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') updateFilmPersonInput: UpdateFilmPersonInput,
  ) {
    return this.filmPersonService.update(id, updateFilmPersonInput);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => Boolean)
  deleteFilmPerson(@Args('id', { type: () => Int }) id: number) {
    return this.filmPersonService.delete(id);
  }

  @ResolveField(() => FilmModel)
  film(
    @Parent() filmPerson: FilmPersonModel,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.filmLoader.load(filmPerson.filmId);
  }

  @ResolveField(() => PersonModel)
  person(
    @Parent() filmPerson: FilmPersonModel,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.personLoader.load(filmPerson.personId);
  }
}
