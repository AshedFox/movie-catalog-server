import { CreateCountryInput } from './create-country.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCountryInput extends PartialType(CreateCountryInput) {}
