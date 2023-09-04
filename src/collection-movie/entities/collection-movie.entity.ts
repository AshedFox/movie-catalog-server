import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, PrimaryColumn, Relation } from 'typeorm';
import { CollectionEntity } from '../../collection/entities/collection.entity';
import { MovieEntity } from '../../movie/entities/movie.entity';
import { FilterableField } from '@common/filter';

@ObjectType('CollectionMovie')
@Entity('collections_movies')
export class CollectionMovieEntity {
  @FilterableField(() => ID)
  @PrimaryColumn()
  collectionId: number;

  @FilterableField(() => ID)
  @PrimaryColumn()
  movieId: string;

  @Field(() => CollectionEntity)
  @ManyToOne(() => CollectionEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  collection: Relation<CollectionEntity>;

  @Field(() => MovieEntity)
  @ManyToOne(() => MovieEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  movie: Relation<MovieEntity>;
}
