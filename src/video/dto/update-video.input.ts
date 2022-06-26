import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateVideoInput } from './create-video.input';

@InputType()
export class UpdateVideoInput extends PartialType(
  OmitType(CreateVideoInput, ['qualitiesIds']),
) {}
