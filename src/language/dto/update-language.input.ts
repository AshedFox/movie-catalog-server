import { CreateLanguageInput } from './create-language.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateLanguageInput extends PartialType(CreateLanguageInput) {}
