import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { FilterableField, FilterableRelation } from '@common/filter';
import { CollectionEntity } from '../../collection/entities/collection.entity';

@ObjectType('CollectionReview')
@Entity('collections_reviews')
export class CollectionReviewEntity {
  @FilterableField(() => ID)
  @PrimaryGeneratedColumn({ type: 'int8' })
  id: number;

  @FilterableField()
  @Column()
  @Index()
  userId: string;

  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  user: UserEntity;

  @FilterableField(() => Int)
  @Column()
  @Index()
  collectionId: number;

  @FilterableRelation(() => CollectionEntity)
  @ManyToOne(() => CollectionEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  collection: CollectionEntity;

  @FilterableField(() => Int)
  @Column({ type: 'int2' })
  @Index()
  mark: number;

  @FilterableField({ nullable: true })
  @Column({ type: 'text', nullable: true })
  text?: string;

  @FilterableField()
  @CreateDateColumn()
  @Index()
  createdAt: Date;

  @FilterableField()
  @UpdateDateColumn()
  updatedAt: Date;
}
