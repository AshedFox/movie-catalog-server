import { CreateSeriesInput } from './create-series.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSeriesInput extends PartialType(CreateSeriesInput) {}
