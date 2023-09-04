import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, PrimaryColumn, Relation } from 'typeorm';
import { MovieEntity } from '../../movie/entities/movie.entity';
import { StudioEntity } from '../../studio/entities/studio.entity';
import { FilterableField } from '@common/filter';

@ObjectType('MovieStudio')
@Entity('movies_studios')
export class MovieStudioEntity {
  @FilterableField(() => ID)
  @PrimaryColumn()
  movieId: string;

  @FilterableField(() => ID)
  @PrimaryColumn()
  studioId: number;

  @Field(() => MovieEntity)
  @ManyToOne(() => MovieEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  movie: Relation<MovieEntity>;

  @Field(() => StudioEntity)
  @ManyToOne(() => StudioEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  studio: Relation<StudioEntity>;
}
