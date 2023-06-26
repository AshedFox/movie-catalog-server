import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MovieImageTypeEntity } from '../../movie-image-type/entities/movie-image-type.entity';
import { MediaEntity } from '../../media/entities/media.entity';
import { MovieEntity } from '../../movie/entities/movie.entity';
import { FilterableField, FilterableRelation } from '@common/filter';

@ObjectType('MovieImage')
@Entity('movies_images')
export class MovieImageEntity {
  @FilterableField(() => ID)
  @PrimaryGeneratedColumn({ type: 'int8' })
  id: number;

  @FilterableField(() => Int, { nullable: true })
  @Column({ nullable: true, type: 'int2' })
  @Index()
  typeId?: number;

  @FilterableRelation(() => MovieImageTypeEntity, { nullable: true })
  @ManyToOne(() => MovieImageTypeEntity, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  type?: MovieImageTypeEntity;

  @FilterableField(() => ID)
  @Column({ type: 'uuid' })
  @Index()
  imageId: string;

  @FilterableField(() => ID)
  @Column({ type: 'uuid' })
  @Index()
  movieId: string;

  @Field(() => MediaEntity)
  @ManyToOne(() => MediaEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  image: MediaEntity;

  @FilterableRelation(() => MovieEntity)
  @ManyToOne(() => MovieEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  movie: MovieEntity;
}
