import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { RoomEntity } from '../../room/entities/room.entity';
import { FilterableField } from '@common/filter';

@ObjectType('RoomParticipant')
@Entity('rooms_participants')
export class RoomParticipantEntity {
  @FilterableField(() => ID)
  @PrimaryColumn()
  roomId: string;

  @FilterableField(() => ID)
  @PrimaryColumn()
  userId: string;

  @Field(() => RoomEntity)
  @ManyToOne(() => RoomEntity, (room) => room.participants, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  room: RoomEntity;

  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  user: UserEntity;
}
