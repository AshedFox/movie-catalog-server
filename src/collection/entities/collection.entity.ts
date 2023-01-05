import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MediaEntity } from '../../media/entities/media.entity';
import { CollectionMovieEntity } from '../../collection-movie/entities/collection-movie.entity';
import { MovieEntity } from '../../movie/entities/movie.entity';
import { FilterableField } from '@common/filter';

@ObjectType()
@Entity('collections')
export class CollectionEntity {
  @FilterableField(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @FilterableField()
  @Column()
  name: string;

  @FilterableField({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @FilterableField()
  @Column({ default: false })
  isSystem: boolean;

  @FilterableField()
  @CreateDateColumn()
  createdAt: Date;

  @FilterableField()
  @UpdateDateColumn()
  updatedAt: Date;

  @FilterableField({ nullable: true })
  @Column({ nullable: true, type: 'int8' })
  @Index({ where: 'cover_id IS NOT NULL' })
  coverId?: number;

  @Field(() => MediaEntity, { nullable: true })
  @ManyToOne(() => MediaEntity, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  cover?: MediaEntity;

  @Field(() => MovieEntity)
  movies: MovieEntity[];

  @HideField()
  @OneToMany(
    () => CollectionMovieEntity,
    (collectionMovie) => collectionMovie.collection,
  )
  moviesConnection: CollectionMovieEntity[];
}
