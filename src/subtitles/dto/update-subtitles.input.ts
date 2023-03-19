import { CreateSubtitlesInput } from './create-subtitles.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSubtitlesInput extends PartialType(CreateSubtitlesInput) {}
