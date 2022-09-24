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

@ObjectType()
@Entity('collections')
export class CollectionEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field({ nullable: true })
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
