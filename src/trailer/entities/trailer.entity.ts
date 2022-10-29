import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { VideoEntity } from '../../video/entities/video.entity';
import { MovieEntity } from '../../movie/entities/movie.entity';
import { FilterableField } from '../../common/filter';

@ObjectType()
@Entity('trailers')
@Unique(['movieId', 'videoId'])
export class TrailerEntity {
  @FilterableField(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  title?: string;

  @FilterableField()
  @CreateDateColumn()
  createdAt: Date;

  @FilterableField()
  @Column()
  movieId: string;

  @Field(() => MovieEntity)
  @ManyToOne(() => MovieEntity)
  movie: MovieEntity;

  @FilterableField()
  @Column()
  videoId: string;

  @Field(() => VideoEntity)
  @ManyToOne(() => VideoEntity)
  video: VideoEntity;
}
