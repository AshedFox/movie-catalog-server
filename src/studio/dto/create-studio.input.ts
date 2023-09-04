import { Field, InputType } from '@nestjs/graphql';
import { StudioEntity } from '../entities/studio.entity';
import { ArrayNotEmpty, IsArray, IsOptional, Length } from 'class-validator';

@InputType()
export class CreateStudioInput implements Partial<StudioEntity> {
  @Field()
  @Length(1, 255)
  name: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  countriesIds?: string[];
}
