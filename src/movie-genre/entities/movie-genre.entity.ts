import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, PrimaryColumn, Relation } from 'typeorm';
import { GenreEntity } from '../../genre/entities/genre.entity';
import { MovieEntity } from '../../movie/entities/movie.entity';
import { FilterableField } from '@common/filter';

@ObjectType('MovieGenre')
@Entity('movies_genres')
export class MovieGenreEntity {
  @FilterableField(() => ID)
  @PrimaryColumn()
  genreId: string;

  @FilterableField(() => ID)
  @PrimaryColumn()
  movieId: string;

  @Field(() => GenreEntity)
  @ManyToOne(() => GenreEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  genre: Relation<GenreEntity>;

  @Field(() => MovieEntity)
  @ManyToOne(() => MovieEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  movie: Relation<MovieEntity>;
}
