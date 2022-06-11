import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SeriesModel } from '../../series/entities/series.model';
import { EpisodeModel } from '../../episode/entities/episode.model';
import { AgeRestrictionEnum } from '../../shared/age-restriction.enum';

@ObjectType()
@Entity({ name: 'seasons' })
export class SeasonModel extends BaseEntity {
  @Field()
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

  @Field()
  @Column()
  premierDate!: Date;

  @Field()
  @CreateDateColumn()
  publicationDate!: Date;

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
