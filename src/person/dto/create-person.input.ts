import { Field, InputType } from '@nestjs/graphql';
import { PersonModel } from '../entities/person.model';

@InputType()
export class CreatePersonInput implements Partial<PersonModel> {
  @Field()
  name!: string;
}
