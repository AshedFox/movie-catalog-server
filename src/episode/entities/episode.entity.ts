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
import { SeasonEntity } from '../../season/entities/season.entity';
import { SeriesEntity } from '../../series/entities/series.entity';
import { AgeRestrictionEnum } from '../../utils/enums/age-restriction.enum';
import { VideoEntity } from '../../video/entities/video.entity';
import { AccessModeEnum } from '../../utils/enums/access-mode.enum';

@ObjectType()
@Entity({ name: 'episodes' })
@Unique(['numberInSeries', 'seriesId'])
export class EpisodeEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @Field(() => AgeRestrictionEnum, { nullable: true })
  @Column({ type: 'enum', enum: AgeRestrictionEnum, nullable: true })
  ageRestriction?: AgeRestrictionEnum;

  @Field({ nullable: true })
  @Column({ nullable: true })
  releaseDate?: Date;

  @Field()
  @CreateDateColumn()
  publicationDate: Date;

  @Field(() => AccessModeEnum)
  @Column({
    type: 'enum',
    enum: AccessModeEnum,
    default: AccessModeEnum.PRIVATE,
  })
  accessMode: AccessModeEnum;

  @Field(() => Int)
  @Column({ type: 'int' })
  numberInSeries: number;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  numberInSeason?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  seasonId?: string;

  @Field(() => SeasonEntity, { nullable: true })
  @ManyToOne(() => SeasonEntity, { nullable: true })
  season?: SeasonEntity;

  @Field()
  @Column()
  seriesId: string;

  @Field(() => SeriesEntity)
  @ManyToOne(() => SeriesEntity)
  series: SeriesEntity;

  @Field({ nullable: true })
  @Column({ nullable: true })
  videoId?: string;

  @Field(() => VideoEntity, { nullable: true })
  @OneToOne(() => VideoEntity, { nullable: true })
  video?: VideoEntity;
}
