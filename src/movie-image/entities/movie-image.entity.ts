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

@ObjectType()
@Entity('movies_images')
export class MovieImageEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => MovieImageTypeEnum)
  @Column({ type: 'enum', enum: MovieImageTypeEnum })
  type: MovieImageTypeEnum;

  @Field(() => ID)
  @PrimaryColumn()
  imageId: string;

  @Field(() => ID)
  @PrimaryColumn()
  movieId: string;

  @Field(() => ImageEntity)
  @ManyToOne(() => ImageEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  image: ImageEntity;

  @Field(() => MovieEntity)
  @ManyToOne(() => MovieEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  movie: MovieEntity;
}
