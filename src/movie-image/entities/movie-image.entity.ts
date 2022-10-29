import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ImageEntity } from '../../image/entities/image.entity';
import { MovieEntity } from '../../movie/entities/movie.entity';
import { MovieImageTypeEnum } from '../../utils/enums/movie-image-type.enum';
import { FilterableField } from '../../common/filter';

@ObjectType()
@Entity('movies_images')
export class MovieImageEntity {
  @FilterableField(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @FilterableField(() => MovieImageTypeEnum)
  @Column({ type: 'enum', enum: MovieImageTypeEnum })
  type: MovieImageTypeEnum;

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
