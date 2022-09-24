import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { CollectionEntity } from '../../collection/entities/collection.entity';
import { MovieEntity } from '../../movie/entities/movie.entity';

@ObjectType()
@Entity('collections_movies')
export class CollectionMovieEntity {
  @Field(() => ID)
  @PrimaryColumn()
  collectionId: number;

  @Field(() => ID)
  @PrimaryColumn()
  movieId: string;

  @Field(() => CollectionEntity)
  @ManyToOne(() => CollectionEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  collection: CollectionEntity;

  @Field(() => MovieEntity)
  @ManyToOne(() => MovieEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  movie: MovieEntity;
}
