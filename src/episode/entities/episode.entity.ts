import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { AgeRestrictionEnum } from '@utils/enums/age-restriction.enum';
import { SeasonEntity } from '../../season/entities/season.entity';
import { SeriesEntity } from '../../series/entities/series.entity';
import { AccessModeEnum } from '@utils/enums/access-mode.enum';
import { FilterableField } from '@common/filter';
import { VideoEntity } from '../../video/entities/video.entity';

@ObjectType('Episode')
@Entity('episodes')
@Unique(['numberInSeries', 'seriesId'])
export class EpisodeEntity {
  @FilterableField(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @FilterableField({ nullable: true })
  @Column({ nullable: true, length: 255 })
  title?: string;

  @FilterableField({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @FilterableField(() => AgeRestrictionEnum, { nullable: true })
  @Column({
    type: 'enum',
    enum: AgeRestrictionEnum,
    enumName: 'age_restriction_enum',
  })
  ageRestriction?: AgeRestrictionEnum;

  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  @Index({ where: 'release_date IS NOT NULL' })
  releaseDate?: Date;

  @FilterableField()
  @CreateDateColumn()
  publicationDate: Date;

  @FilterableField(() => AccessModeEnum)
  @Column({
    type: 'enum',
    enum: AccessModeEnum,
    enumName: 'access_mode_enum',
    default: AccessModeEnum.PRIVATE,
  })
  @Index({ where: "access_mode = 'PUBLIC'" })
  accessMode: AccessModeEnum;

  @FilterableField(() => Int)
  @Column({ type: 'int2' })
  numberInSeries: number;

  @FilterableField(() => Int, { nullable: true })
  @Column({ type: 'int2', nullable: true })
  numberInSeason?: number;

  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  @Index({ where: 'season_id IS NOT NULL' })
  seasonId?: string;

  @Field(() => SeasonEntity, { nullable: true })
  @ManyToOne(() => SeasonEntity, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  season?: SeasonEntity;

  @FilterableField()
  @Column()
  seriesId: string;

  @Field(() => SeriesEntity)
  @ManyToOne(() => SeriesEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  series: SeriesEntity;

  @FilterableField({ nullable: true })
  @Column({ nullable: true, type: 'int4' })
  @Index({ where: 'video_id IS NOT NULL' })
  videoId?: number;

  @Field(() => VideoEntity, { nullable: true })
  @OneToOne(() => VideoEntity, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  video?: VideoEntity;
}
