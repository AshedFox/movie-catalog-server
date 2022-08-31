import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { GenreEntity } from '../../genre/entities/genre.entity';
import { MovieEntity } from '../../movie/entities/movie.entity';

@ObjectType()
@Entity('movies_genres')
export class MovieGenreEntity {
  @Field(() => ID)
  @PrimaryColumn()
  genreId: string;

  @Field(() => ID)
  @PrimaryColumn()
  movieId: string;

  @Field(() => GenreEntity)
  @ManyToOne(() => GenreEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  genre: GenreEntity;

  @Field(() => MovieEntity)
  @ManyToOne(() => MovieEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  movie: MovieEntity;
}