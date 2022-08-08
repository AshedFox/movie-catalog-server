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

@ObjectType()
@Entity('trailers')
@Unique(['movieId', 'videoId'])
export class TrailerEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  title?: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @Column()
  movieId: string;

  @Field(() => MovieEntity)
  @ManyToOne(() => MovieEntity)
  movie: MovieEntity;

  @Field()
  @Column()
  videoId: string;

  @Field(() => VideoEntity)
  @ManyToOne(() => VideoEntity)
  video: VideoEntity;
}
