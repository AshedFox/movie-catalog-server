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
import { PersonService } from './person.service';
import { CreatePersonInput } from './dto/create-person.input';
import { UpdatePersonInput } from './dto/update-person.input';
import { PersonEntity } from './entities/person.entity';
import { UseGuards } from '@nestjs/common';
import { PaginatedPersons } from './dto/paginated-persons';
import { GetPersonsArgs } from './dto/get-persons.args';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '@utils/enums';
import { CountryEntity } from '../country/entities/country.entity';
import { IDataLoaders } from '../dataloader/idataloaders.interface';

@Resolver(PersonEntity)
export class PersonResolver {
  constructor(private readonly personService: PersonService) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => PersonEntity)
  createPerson(@Args('input') createPersonInput: CreatePersonInput) {
    return this.personService.create(createPersonInput);
  }

  @Query(() => PaginatedPersons)
  async getPersons(@Args() { sort, filter, ...pagination }: GetPersonsArgs) {
    const [data, count] = await Promise.all([
      this.personService.readMany(pagination, sort, filter),
      this.personService.count(filter),
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

  @Query(() => PersonEntity)
  getPerson(@Args('id', { type: () => Int }) id: number) {
    return this.personService.readOne(id);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => PersonEntity)
  updatePerson(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') updatePersonInput: UpdatePersonInput,
  ) {
    return this.personService.update(id, updatePersonInput);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => PersonEntity)
  deletePerson(@Args('id', { type: () => Int }) id: number) {
    return this.personService.delete(id);
  }

  @ResolveField(() => CountryEntity)
  country(
    @Parent() person: PersonEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return person.countryId
      ? loaders.countryLoader.load(person.countryId)
      : undefined;
  }
}
