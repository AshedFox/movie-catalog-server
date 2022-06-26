import { CreateStudioInput } from './create-studio.input';
import { InputType, OmitType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateStudioInput extends PartialType(
  OmitType(CreateStudioInput, ['countriesIds']),
) {}
