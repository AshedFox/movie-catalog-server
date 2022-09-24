import { Field, InputType } from '@nestjs/graphql';
import { CollectionEntity } from '../entities/collection.entity';
import {
  ArrayNotEmpty,
  IsArray,
  IsOptional,
  IsUUID,
  Length,
} from 'class-validator';

@InputType()
export class CreateCollectionInput implements Partial<CollectionEntity> {
  @Field()
  @Length(1, 200)
  name: string;

  @Field({ nullable: true })
  @Length(1, 2000)
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsUUID()
  @IsOptional()
  coverId?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  moviesIds?: string[];
}
