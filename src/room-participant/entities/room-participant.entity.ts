import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { RoomEntity } from '../../room/entities/room.entity';

@ObjectType()
@Entity('rooms_participants')
export class RoomParticipantEntity {
  @Field(() => ID)
  @PrimaryColumn()
  roomId: string;

  @Field(() => ID)
  @PrimaryColumn()
  userId: string;

  @Field(() => RoomEntity)
  @ManyToOne(() => RoomEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  room: RoomEntity;

  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  user: UserEntity;
}
