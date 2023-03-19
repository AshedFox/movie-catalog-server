import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { FilterableField } from '@common/filter';
import { Column, Entity, ManyToOne, PrimaryColumn, Unique } from 'typeorm';
import { RoomEntity } from '../../room/entities/room.entity';
import { VideoEntity } from '../../video/entities/video.entity';

@ObjectType('RoomVideo')
@Entity('rooms_videos')
@Unique(['roomId', 'order'])
export class RoomVideoEntity {
  @FilterableField(() => ID)
  @PrimaryColumn()
  videoId: number;

  @Field(() => VideoEntity)
  @ManyToOne(() => VideoEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  video: VideoEntity;

  @FilterableField(() => ID)
  @PrimaryColumn()
  roomId: string;

  @Field(() => RoomEntity)
  @ManyToOne(() => RoomEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  room: RoomEntity;

  @Field(() => Int)
  @Column({ type: 'int2' })
  order: number;
}
