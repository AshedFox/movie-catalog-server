import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  Unique,
} from 'typeorm';
import { VideoEntity } from '../../video/entities/video.entity';
import { MovieEntity } from '../../movie/entities/movie.entity';
import { FilterableField } from '@common/filter';

@ObjectType('Trailer')
@Entity('trailers')
@Unique(['movieId', 'videoId'])
export class TrailerEntity {
  @FilterableField(() => ID)
  @PrimaryGeneratedColumn({ type: 'int4' })
  id: number;

  @FilterableField({ nullable: true })
  @Column({ nullable: true, length: 255 })
  title?: string;

  @FilterableField()
  @CreateDateColumn()
  createdAt: Date;

  @FilterableField()
  @Column()
  movieId: string;

  @Field(() => MovieEntity)
  @ManyToOne(() => MovieEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  movie: Relation<MovieEntity>;

  @FilterableField()
  @Column()
  videoId: number;

  @Field(() => VideoEntity)
  @ManyToOne(() => VideoEntity, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  video: Relation<VideoEntity>;
}
