import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('RefreshToken')
@Entity('refresh_tokens')
export class RefreshTokenEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  expiresAt: Date;

  @Field()
  @Column()
  userId: string;

  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  user: Relation<UserEntity>;
}
