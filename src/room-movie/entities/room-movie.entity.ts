import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { FilterableField } from '@common/filter';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  Relation,
  Unique,
} from 'typeorm';
import { RoomEntity } from '../../room/entities/room.entity';
import { MovieEntity } from '../../movie/entities/movie.entity';

@ObjectType('RoomMovie')
@Entity('rooms_movies')
@Unique(['roomId', 'order'])
export class RoomMovieEntity {
  @FilterableField(() => ID)
  @PrimaryColumn()
  movieId: string;

  @Field(() => MovieEntity)
  @ManyToOne(() => MovieEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  movie: Relation<MovieEntity>;

  @FilterableField(() => ID)
  @PrimaryColumn()
  roomId: string;

  @Field(() => RoomEntity)
  @ManyToOne(() => RoomEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  room: Relation<RoomEntity>;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  episodeNumber?: number;

  @Field(() => Int)
  @Column({ type: 'int2' })
  order: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  showStart?: Date;
}
