import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PersonService } from './person.service';
import { CreatePersonInput } from './dto/create-person.input';
import { UpdatePersonInput } from './dto/update-person.input';
import { PersonModel } from './entities/person.model';
import { ParseIntPipe } from '@nestjs/common';
import { PaginatedPersons } from './dto/paginated-persons.result';
import { GetPersonsArgs } from './dto/get-persons.args';

@Resolver(PersonModel)
export class PersonResolver {
  constructor(private readonly personService: PersonService) {}

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

  @Mutation(() => PersonModel)
  updatePerson(
    @Args('id', ParseIntPipe) id: number,
    @Args('input') updatePersonInput: UpdatePersonInput,
  ) {
    return this.personService.update(id, updatePersonInput);
  }

  @Mutation(() => Boolean)
  deletePerson(@Args('id', ParseIntPipe) id: number) {
    return this.personService.delete(id);
  }
}
