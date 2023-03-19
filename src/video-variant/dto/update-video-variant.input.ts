import { InputType, PartialType } from '@nestjs/graphql';
import { CreateVideoVariantInput } from './create-video-variant.input';

@InputType()
export class UpdateVideoVariantInput extends PartialType(
  CreateVideoVariantInput,
) {}
