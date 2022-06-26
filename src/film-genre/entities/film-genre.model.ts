import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { GenreModel } from '../../genre/entities/genre.model';
import { FilmModel } from '../../film/entities/film.model';

@ObjectType()
@Entity('films_genres')
export class FilmGenreModel {
  @Field(() => ID)
  @PrimaryColumn()
  genreId!: string;

  @Field(() => ID)
  @PrimaryColumn()
  filmId!: string;

  @Field(() => GenreModel)
  @ManyToOne(() => GenreModel, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  genre!: GenreModel;

  @Field(() => FilmModel)
  @ManyToOne(() => FilmModel, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  film!: FilmModel;
}
