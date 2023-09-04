import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { RoomParticipantEntity } from '../../room-participant/entities/room-participant.entity';
import { FilterableField, FilterableRelation } from '@common/filter';
import { RoomMovieEntity } from '../../room-movie/entities/room-movie.entity';

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
  owner: Relation<UserEntity>;

  @Field(() => RoomMovieEntity, { nullable: true })
  currentMovie?: Relation<RoomMovieEntity>;

  @Field(() => [RoomMovieEntity])
  @OneToMany(() => RoomMovieEntity, (roomMovie) => roomMovie.room)
  movies: Relation<RoomMovieEntity[]>;

  @FilterableRelation(() => [RoomParticipantEntity])
  @OneToMany(
    () => RoomParticipantEntity,
    (roomParticipant) => roomParticipant.room,
  )
  participantsConnection: Relation<RoomParticipantEntity[]>;

  @Field(() => [UserEntity])
  participants: Relation<UserEntity[]>;
}
