import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { SeriesModel } from '../../series/entities/series.model';
import { EpisodeModel } from '../../episode/entities/episode.model';
import { AgeRestrictionEnum } from '../../shared/age-restriction.enum';

@ObjectType()
@Entity({ name: 'seasons' })
@Unique(['seasonNumber', 'seriesId'])
export class SeasonModel {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => Int)
  @Column({ type: 'int' })
  seasonNumber!: number;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column({ default: '' })
  description!: string;

  @Field(() => AgeRestrictionEnum)
  @Column({ type: 'enum', enum: AgeRestrictionEnum })
  ageRestriction!: AgeRestrictionEnum;

  @Field({ nullable: true })
  @Column({ nullable: true })
  startReleaseDate?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  endReleaseDate?: Date;

  @Field()
  @CreateDateColumn()
  publicationDate!: Date;

  @Field(() => Int)
  episodesCount!: number;

  @Field()
  @Column()
  seriesId!: string;

  @Field(() => SeriesModel)
  @ManyToOne(() => SeriesModel)
  series!: SeriesModel;

  @Field(() => [EpisodeModel])
  @OneToMany(() => EpisodeModel, (episode) => episode.season)
  episodes!: EpisodeModel[];
}
