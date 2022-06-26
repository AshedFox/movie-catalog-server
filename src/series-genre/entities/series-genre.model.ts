import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { GenreModel } from '../../genre/entities/genre.model';
import { SeriesModel } from '../../series/entities/series.model';

@ObjectType()
@Entity('series_genres')
export class SeriesGenreModel {
  @Field(() => ID)
  @PrimaryColumn()
  genreId!: string;

  @Field(() => ID)
  @PrimaryColumn()
  seriesId!: string;

  @Field(() => GenreModel)
  @ManyToOne(() => GenreModel, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  genre!: GenreModel;

  @Field(() => SeriesModel)
  @ManyToOne(() => SeriesModel, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  series!: SeriesModel;
}
