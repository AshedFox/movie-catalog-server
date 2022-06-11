import { CreatePersonInput } from './create-person.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePersonInput extends PartialType(CreatePersonInput) {}
