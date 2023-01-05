import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
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
  user: UserEntity;

  @FilterableField(() => ID)
  @PrimaryColumn()
  movieId: string;

  @Field(() => MovieEntity)
  @ManyToOne(() => MovieEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  movie: MovieEntity;

  @FilterableField()
  @Column()
  isWatched: boolean;

  @FilterableField()
  @Column()
  isBookmarked: boolean;
}
