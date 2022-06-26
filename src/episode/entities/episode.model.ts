import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { SeasonModel } from '../../season/entities/season.model';
import { SeriesModel } from '../../series/entities/series.model';
import { AgeRestrictionEnum } from '../../shared/age-restriction.enum';
import { VideoModel } from '../../video/entities/video.model';

@ObjectType()
@Entity({ name: 'episodes' })
@Unique(['episodeNumber', 'seriesId', 'seasonId'])
export class EpisodeModel {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

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
  releaseDate?: Date;

  @Field()
  @CreateDateColumn()
  publicationDate!: Date;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  duration?: number;

  @Field(() => Int)
  @Column({ type: 'int' })
  episodeNumber!: number;

  @Field()
  @Column()
  seasonId!: string;

  @Field(() => SeasonModel)
  @ManyToOne(() => SeasonModel)
  season!: SeasonModel;

  @Field()
  @Column()
  seriesId!: string;

  @Field(() => SeriesModel)
  @ManyToOne(() => SeriesModel)
  series!: SeriesModel;

  @Field({ nullable: true })
  @Column({ nullable: true })
  videoId?: string;

  @Field(() => VideoModel, { nullable: true })
  @OneToOne(() => VideoModel, { nullable: true })
  video?: VideoModel;
}
