import { Field, InputType, Int } from '@nestjs/graphql';
import { StudioEntity } from '../entities/studio.entity';
import { ArrayNotEmpty, IsArray, IsOptional, Length } from 'class-validator';

@InputType()
export class CreateStudioInput implements Partial<StudioEntity> {
  @Field()
  @Length(1, 200)
  name: string;

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  countriesIds?: number[];
}
