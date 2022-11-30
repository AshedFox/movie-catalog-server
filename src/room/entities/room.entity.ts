import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { RoomParticipantEntity } from '../../room-participant/entities/room-participant.entity';
import { VideoEntity } from '../../video/entities/video.entity';

@ObjectType()
@Entity('rooms')
export class RoomEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field({ nullable: true })
  @Column({ unique: true, nullable: true })
  inviteKey?: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  ownerId: string;

  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity)
  owner: UserEntity;

  @Field()
  @Column()
  currentVideoId?: string;

  @Field(() => VideoEntity, { nullable: true })
  @ManyToOne(() => VideoEntity, { nullable: true })
  currentVideo?: VideoEntity;

  @HideField()
  @OneToMany(
    () => RoomParticipantEntity,
    (roomParticipant) => roomParticipant.room,
  )
  participantsConnection: RoomParticipantEntity[];

  @Field(() => [UserEntity])
  participants: UserEntity[];
}
