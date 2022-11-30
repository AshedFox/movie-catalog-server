import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MovieImageTypeEntity } from '../../movie-image-type/entities/movie-image-type.entity';
import { ImageEntity } from '../../image/entities/image.entity';
import { MovieEntity } from '../../movie/entities/movie.entity';
import { FilterableField, FilterableRelation } from '@common/filter';

@ObjectType()
@Entity('movies_images')
export class MovieImageEntity {
  @FilterableField(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  typeId?: number;

  @FilterableRelation(() => MovieImageTypeEntity, { nullable: true })
  @ManyToOne(() => MovieImageTypeEntity, { nullable: true })
  type?: MovieImageTypeEntity;

  @FilterableField(() => ID)
  @PrimaryColumn()
  imageId: string;

  @FilterableField(() => ID)
  @PrimaryColumn()
  movieId: string;

  @Field(() => ImageEntity)
  @ManyToOne(() => ImageEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  image: ImageEntity;

  @Field(() => MovieEntity)
  @ManyToOne(() => MovieEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  movie: MovieEntity;
}
