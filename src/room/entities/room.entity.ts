import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { RoomParticipantEntity } from '../../room-participant/entities/room-participant.entity';
import { VideoEntity } from '../../video/entities/video.entity';
import { FilterableField } from '@common/filter';
import { RoomVideoEntity } from '../../room-video/entities/room-video.entity';

@ObjectType('Room')
@Entity('rooms')
export class RoomEntity {
  @FilterableField(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @FilterableField()
  @Column({ length: 255 })
  @Index()
  name: string;

  @FilterableField()
  @Column({ type: 'uuid' })
  @Index()
  ownerId: string;

  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  owner: UserEntity;

  @Field(() => [VideoEntity])
  videos: VideoEntity[];

  @HideField()
  @OneToMany(() => RoomVideoEntity, (roomVideo) => roomVideo.roomId)
  videosConnection: RoomVideoEntity[];

  @HideField()
  @OneToMany(
    () => RoomParticipantEntity,
    (roomParticipant) => roomParticipant.roomId,
  )
  participantsConnection: RoomParticipantEntity[];

  @Field(() => [UserEntity])
  participants: UserEntity[];
}
