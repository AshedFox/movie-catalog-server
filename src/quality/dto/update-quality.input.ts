import { CreateQualityInput } from './create-quality.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateQualityInput extends PartialType(CreateQualityInput) {}
