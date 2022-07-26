import { CreateSeriesInput } from './create-series.input';
import { InputType, OmitType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSeriesInput extends PartialType(
  OmitType(CreateSeriesInput, ['studiosIds', 'genresIds', 'postersIds']),
) {}
