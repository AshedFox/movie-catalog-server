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
import { FilterableField, FilterableRelation } from '@common/filter';
import { VideoEntity } from '../../video/entities/video.entity';

@ObjectType()
@Entity('episodes')
@Unique(['numberInSeries', 'seriesId'])
export class EpisodeEntity {
  @FilterableField(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  title?: string;

  @FilterableField({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @FilterableRelation(() => AgeRestrictionEnum, { nullable: true })
  @Column({
    type: 'enum',
    enum: AgeRestrictionEnum,
    enumName: 'age_restriction_enum',
  })
  ageRestriction?: AgeRestrictionEnum;

  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  releaseDate?: Date;

  @FilterableField()
  @CreateDateColumn()
  publicationDate: Date;

  @FilterableField(() => AccessModeEnum)
  @Column({
    type: 'enum',
    enum: AccessModeEnum,
    default: AccessModeEnum.PRIVATE,
  })
  accessMode: AccessModeEnum;

  @FilterableField(() => Int)
  @Column({ type: 'int' })
  numberInSeries: number;

  @FilterableField(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  numberInSeason?: number;

  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  seasonId?: string;

  @Field(() => SeasonEntity, { nullable: true })
  @ManyToOne(() => SeasonEntity, { nullable: true })
  season?: SeasonEntity;

  @FilterableField()
  @Column()
  seriesId: string;

  @Field(() => SeriesEntity)
  @ManyToOne(() => SeriesEntity)
  series: SeriesEntity;

  @FilterableField({ nullable: true })
  @Column({ nullable: true, type: 'int8' })
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
