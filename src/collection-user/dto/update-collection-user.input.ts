import { CreateCollectionUserInput } from './create-collection-user.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCollectionUserInput extends PartialType(
  CreateCollectionUserInput,
) {}
