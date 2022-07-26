import { CreateEpisodeInput } from './create-episode.input';
import { InputType, OmitType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateEpisodeInput extends PartialType(
  OmitType(CreateEpisodeInput, ['postersIds']),
) {}
