import { Field, HideField, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { SeasonModel } from '../../season/entities/season.model';
import { SeriesModel } from '../../series/entities/series.model';
import { AgeRestrictionEnum } from '../../shared/age-restriction.enum';
import { VideoModel } from '../../video/entities/video.model';
import { ImageModel } from '../../image/entities/image.model';
import { EpisodePosterModel } from '../../episode-poster/entities/episode-poster.model';
import { AccessModeEnum } from '../../shared/access-mode.enum';

@ObjectType()
@Entity({ name: 'episodes' })
@Unique(['numberInSeries', 'seriesId'])
export class EpisodeModel {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field(() => AgeRestrictionEnum, { nullable: true })
  @Column({ type: 'enum', enum: AgeRestrictionEnum, nullable: true })
  ageRestriction?: AgeRestrictionEnum;

  @Field({ nullable: true })
  @Column({ nullable: true })
  releaseDate?: Date;

  @Field()
  @CreateDateColumn()
  publicationDate!: Date;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  duration?: number;

  @Field(() => AccessModeEnum)
  @Column({
    type: 'enum',
    enum: AccessModeEnum,
    default: AccessModeEnum.PRIVATE,
  })
  accessMode!: AccessModeEnum;

  @Field(() => Int)
  @Column({ type: 'int' })
  numberInSeries!: number;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  numberInSeason?: number;

  @Field(() => [ImageModel])
  posters!: ImageModel[];

  @HideField()
  @OneToMany(() => EpisodePosterModel, (episodePoster) => episodePoster.episode)
  postersConnection!: EpisodePosterModel[];

  @Field({ nullable: true })
  @Column({ nullable: true })
  seasonId?: string;

  @Field(() => SeasonModel, { nullable: true })
  @ManyToOne(() => SeasonModel, { nullable: true })
  season?: SeasonModel;

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
