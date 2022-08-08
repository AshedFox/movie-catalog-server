import { Field, InputType } from '@nestjs/graphql';
import { TrailerEntity } from '../entities/trailer.entity';
import { IsOptional, IsUUID, MinLength } from 'class-validator';

@InputType()
export class CreateTrailerInput implements Partial<TrailerEntity> {
  @Field({ nullable: true })
  @MinLength(1)
  @IsOptional()
  title?: string;

  @Field()
  @IsUUID()
  movieId: string;

  @Field()
  @IsUUID()
  videoId: string;
}
