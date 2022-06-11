import { CreateEpisodeInput } from './create-episode.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateEpisodeInput extends PartialType(CreateEpisodeInput) {}
