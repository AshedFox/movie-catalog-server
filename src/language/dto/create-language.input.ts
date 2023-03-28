import { Field, InputType } from '@nestjs/graphql';
import { Length } from 'class-validator';

@InputType()
export class CreateLanguageInput {
  @Field()
  @Length(3, 3)
  id: string;

  @Field()
  @Length(2, 255)
  name: string;
}
