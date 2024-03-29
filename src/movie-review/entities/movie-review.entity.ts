import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { MovieEntity } from '../../movie/entities/movie.entity';
import { FilterableField, FilterableRelation } from '@common/filter';

@ObjectType('MovieReview')
@Entity('movies_reviews')
export class MovieReviewEntity {
  @FilterableField(() => ID)
  @PrimaryGeneratedColumn({ type: 'int8' })
  id: number;

  @FilterableField(() => ID)
  @Column()
  @Index()
  userId: string;

  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  user: Relation<UserEntity>;

  @FilterableField(() => ID)
  @Column()
  @Index()
  movieId: string;

  @FilterableRelation(() => MovieEntity)
  @ManyToOne(() => MovieEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  movie: Relation<MovieEntity>;

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
