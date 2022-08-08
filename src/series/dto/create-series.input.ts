import { Field, InputType } from '@nestjs/graphql';
import { SeriesEntity } from '../entities/series.entity';
import { IsOptional } from 'class-validator';
import { CreateMovieInput } from '../../movie/dto/create-movie.input';

@InputType()
export class CreateSeriesInput
  extends CreateMovieInput
  implements Partial<SeriesEntity>
{
  @Field({ nullable: true })
  @IsOptional()
  startReleaseDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  endReleaseDate?: Date;
}
