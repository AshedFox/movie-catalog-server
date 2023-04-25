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
  @Length(1, 255)
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  isSystem?: boolean;

  @Field({ nullable: true })
  @Length(1, 20000)
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  coverId?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  moviesIds?: string[];
}
