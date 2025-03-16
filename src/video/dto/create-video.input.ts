import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class CreateVideoInput {
  @Field()
  @IsUUID()
  originalMediaId: string;
}
