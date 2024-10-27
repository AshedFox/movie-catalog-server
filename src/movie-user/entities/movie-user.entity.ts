import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryColumn, Relation } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { MovieEntity } from '../../movie/entities/movie.entity';
import { FilterableField } from '@common/filter';

@ObjectType('MovieUser')
@Entity('movies_users')
export class MovieUserEntity {
  @FilterableField(() => ID)
  @PrimaryColumn()
  userId: string;

  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  user: Relation<UserEntity>;

  @FilterableField(() => ID)
  @PrimaryColumn()
  movieId: string;

  @Field(() => MovieEntity)
  @ManyToOne(() => MovieEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  movie: Relation<MovieEntity>;

  @FilterableField()
  @Column({ default: false })
  isWatched: boolean;

  @FilterableField()
  @Column({ default: false })
  isBookmarked: boolean;

  @FilterableField()
  @Column({ default: false })
  isFavorite: boolean;
}
