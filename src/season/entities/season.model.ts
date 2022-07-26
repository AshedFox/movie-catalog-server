import { Field, HideField, ID, Int, ObjectType } from '@nestjs/graphql';
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
import { ImageModel } from '../../image/entities/image.model';
import { SeasonPosterModel } from '../../season-poster/entities/season-poster.model';
import { AccessModeEnum } from '../../shared/access-mode.enum';

@ObjectType()
@Entity({ name: 'seasons' })
@Unique(['numberInSeries', 'seriesId'])
export class SeasonModel {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => Int)
  @Column({ type: 'int' })
  numberInSeries!: number;

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
  startReleaseDate?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  endReleaseDate?: Date;

  @Field()
  @CreateDateColumn()
  publicationDate!: Date;

  @Field(() => AccessModeEnum)
  @Column({
    type: 'enum',
    enum: AccessModeEnum,
    default: AccessModeEnum.PRIVATE,
  })
  accessMode!: AccessModeEnum;

  @Field(() => Int)
  episodesCount!: number;

  @Field(() => [ImageModel])
  posters!: ImageModel[];

  @HideField()
  @OneToMany(() => SeasonPosterModel, (seasonPoster) => seasonPoster.season)
  postersConnection!: SeasonPosterModel[];

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
