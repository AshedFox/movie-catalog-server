import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PersonService } from './person.service';
import { CreatePersonInput } from './dto/create-person.input';
import { UpdatePersonInput } from './dto/update-person.input';
import { PersonModel } from './entities/person.model';
import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { PaginatedPersons } from './dto/paginated-persons.result';
import { GetPersonsArgs } from './dto/get-persons.args';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '../shared/role.enum';

@Resolver(PersonModel)
export class PersonResolver {
  constructor(private readonly personService: PersonService) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => PersonModel)
  createPerson(@Args('input') createPersonInput: CreatePersonInput) {
    return this.personService.create(createPersonInput);
  }

  @Query(() => PaginatedPersons)
  getPersons(@Args() { searchName, take, skip }: GetPersonsArgs) {
    return this.personService.readAll(searchName, take, skip);
  }

  @Query(() => PersonModel, { nullable: true })
  getPerson(@Args('id', ParseIntPipe) id: number) {
    return this.personService.readOne(id);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => PersonModel)
  updatePerson(
    @Args('id', ParseIntPipe) id: number,
    @Args('input') updatePersonInput: UpdatePersonInput,
  ) {
    return this.personService.update(id, updatePersonInput);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => Boolean)
  deletePerson(@Args('id', ParseIntPipe) id: number) {
    return this.personService.delete(id);
  }
}
