import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ImageEntity } from '../../image/entities/image.entity';
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
  @Column({ nullable: true })
  coverId?: string;

  @Field(() => ImageEntity, { nullable: true })
  @ManyToOne(() => ImageEntity, { nullable: true })
  cover?: ImageEntity;

  @Field(() => MovieEntity)
  movies: MovieEntity[];

  @HideField()
  @OneToMany(
    () => CollectionMovieEntity,
    (collectionMovie) => collectionMovie.collection,
  )
  moviesConnection: CollectionMovieEntity[];
}
