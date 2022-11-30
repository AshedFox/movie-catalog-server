import { Field, InputType } from '@nestjs/graphql';
import { SeriesEntity } from '../entities/series.entity';
import { IsDate, IsOptional } from 'class-validator';
import { CreateMovieInput } from '../../movie/dto/create-movie.input';

@InputType()
export class CreateSeriesInput
  extends CreateMovieInput
  implements Partial<SeriesEntity>
{
  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  startReleaseDate?: Date;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  endReleaseDate?: Date;
}
