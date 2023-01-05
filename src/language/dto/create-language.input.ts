import { Field, HideField, InputType } from '@nestjs/graphql';
import { Length } from 'class-validator';

@InputType()
export class CreateLanguageInput {
  @HideField()
  id: string;

  @Field()
  @Length(2, 2)
  languageCode: string;

  @Field()
  @Length(2, 3)
  countryCode: string;

  @Field()
  @Length(2, 255)
  name: string;
}
