import { Field, InputType } from '@nestjs/graphql';
import { StudioModel } from '../entities/studio.model';

@InputType()
export class CreateStudioInput implements Partial<StudioModel> {
  @Field()
  name!: string;
}
