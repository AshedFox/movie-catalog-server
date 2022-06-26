import { CreateImageInput } from './create-image.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateImageInput extends PartialType(CreateImageInput) {}
