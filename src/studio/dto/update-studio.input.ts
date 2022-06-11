import { CreateStudioInput } from './create-studio.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateStudioInput extends PartialType(CreateStudioInput) {}
