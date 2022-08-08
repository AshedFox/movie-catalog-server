import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { MovieEntity } from '../../movie/entities/movie.entity';
import { StudioEntity } from '../../studio/entities/studio.entity';

@ObjectType()
@Entity('movies_studios')
export class MovieStudioEntity {
  @Field(() => ID)
  @PrimaryColumn()
  movieId: string;

  @Field(() => ID)
  @PrimaryColumn()
  studioId: number;

  @Field(() => MovieEntity)
  @ManyToOne(() => MovieEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  movie: MovieEntity;

  @Field(() => StudioEntity)
  @ManyToOne(() => StudioEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  studio: StudioEntity;
}
