import { CreateCollectionInput } from './create-collection.input';
import { InputType, OmitType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCollectionInput extends PartialType(
  OmitType(CreateCollectionInput, ['moviesIds']),
) {}
