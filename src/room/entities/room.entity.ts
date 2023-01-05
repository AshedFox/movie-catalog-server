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
import { FilterableField } from '@common/filter';

@ObjectType()
@Entity('rooms')
export class RoomEntity {
  @FilterableField(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @FilterableField({ nullable: true })
  @Column({ unique: true, nullable: true })
  inviteKey?: string;

  @FilterableField()
  @Column()
  name: string;

  @FilterableField()
  @Column()
  ownerId: string;

  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity)
  owner: UserEntity;

  @FilterableField({ nullable: true })
  @Column({ nullable: true, type: 'int8' })
  @Index()
  currentVideoId?: number;

  @Field(() => VideoEntity, { nullable: true })
  @ManyToOne(() => VideoEntity, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
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
