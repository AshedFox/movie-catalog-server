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

@ObjectType('Collection')
@Entity('collections')
export class CollectionEntity {
  @FilterableField(() => ID)
  @PrimaryGeneratedColumn({ type: 'int4' })
  id: number;

  @FilterableField()
  @Column({ length: 255 })
  @Index()
  name: string;

  @FilterableField({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @FilterableField()
  @Column({ default: false })
  @Index()
  isSystem: boolean;

  @FilterableField()
  @CreateDateColumn()
  @Index()
  createdAt: Date;

  @FilterableField()
  @UpdateDateColumn()
  @Index()
  updatedAt: Date;

  @FilterableField({ nullable: true })
  @Column({ nullable: true, type: 'uuid' })
  @Index({ where: 'cover_id IS NOT NULL' })
  coverId?: string;

  @Field(() => MediaEntity, { nullable: true })
  @ManyToOne(() => MediaEntity, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  cover?: MediaEntity;

  @Field(() => [MovieEntity])
  movies: MovieEntity[];

  @HideField()
  @OneToMany(
    () => CollectionMovieEntity,
    (collectionMovie) => collectionMovie.collection,
  )
  moviesConnection: CollectionMovieEntity[];
}
