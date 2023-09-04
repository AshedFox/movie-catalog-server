import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryColumn, Relation } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { CollectionEntity } from '../../collection/entities/collection.entity';
import { FilterableField } from '@common/filter';

@ObjectType('CollectionUser')
@Entity('collections_users')
export class CollectionUserEntity {
  @FilterableField(() => ID)
  @PrimaryColumn()
  userId: string;

  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  user: Relation<UserEntity>;

  @FilterableField(() => ID)
  @PrimaryColumn()
  collectionId: number;

  @Field(() => CollectionEntity)
  @ManyToOne(() => CollectionEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  collection: Relation<CollectionEntity>;

  @FilterableField()
  @Column({ default: false })
  isWatched: boolean;

  @FilterableField()
  @Column({ default: false })
  isBookmarked: boolean;
}
