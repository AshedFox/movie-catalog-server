import { Field, InputType, Int } from '@nestjs/graphql';
import { StudioModel } from '../entities/studio.model';
import { IsArray, IsOptional, Length } from 'class-validator';

@InputType()
export class CreateStudioInput implements Partial<StudioModel> {
  @Field()
  @Length(1, 200)
  name!: string;

  @Field(() => [Int], { nullable: true, defaultValue: [] })
  @IsArray()
  @IsOptional()
  countriesIds?: number[];
}
