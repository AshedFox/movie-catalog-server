import { CreateAgeRestrictionInput } from './create-age-restriction.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAgeRestrictionInput extends PartialType(
  CreateAgeRestrictionInput,
) {}
