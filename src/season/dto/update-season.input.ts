import { CreateSeasonInput } from './create-season.input';
import { InputType, OmitType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSeasonInput extends PartialType(
  OmitType(CreateSeasonInput, ['postersIds']),
) {}
