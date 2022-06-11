import { CreateSeasonInput } from './create-season.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSeasonInput extends PartialType(CreateSeasonInput) {}
