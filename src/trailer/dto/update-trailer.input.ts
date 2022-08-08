import { CreateTrailerInput } from './create-trailer.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTrailerInput extends PartialType(CreateTrailerInput) {}
