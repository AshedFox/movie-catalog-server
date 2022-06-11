import { CreateSeriesPersonInput } from './create-series-person.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSeriesPersonInput extends PartialType(
  CreateSeriesPersonInput,
) {}
