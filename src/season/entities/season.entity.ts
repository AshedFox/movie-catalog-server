import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { AgeRestrictionEntity } from '../../age-restrictions/entities/age-restriction.entity';
import { SeriesEntity } from '../../series/entities/series.entity';
import { EpisodeEntity } from '../../episode/entities/episode.entity';
import { FilterableField, FilterableRelation } from '@common/filter';
import { AccessModeEnum } from '@utils/enums/access-mode.enum';

@ObjectType()
@Entity({ name: 'seasons' })
@Unique(['numberInSeries', 'seriesId'])
export class SeasonEntity {
  @FilterableField(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @FilterableField(() => Int)
  @Column({ type: 'int' })
  numberInSeries: number;

  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  title?: string;

  @FilterableField({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  ageRestrictionId?: number;

  @FilterableRelation(() => AgeRestrictionEntity, { nullable: true })
  @ManyToOne(() => AgeRestrictionEntity)
  ageRestriction?: AgeRestrictionEntity;

  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  startReleaseDate?: Date;

  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  endReleaseDate?: Date;

  @FilterableField()
  @CreateDateColumn()
  createdAt: Date;

  @FilterableField()
  @UpdateDateColumn()
  updatedAt: Date;

  @FilterableField(() => AccessModeEnum)
  @Column({
    type: 'enum',
    enum: AccessModeEnum,
    default: AccessModeEnum.PRIVATE,
  })
  accessMode: AccessModeEnum;

  @Field(() => Int)
  episodesCount: number;

  @FilterableField()
  @Column()
  seriesId: string;

  @FilterableRelation(() => SeriesEntity)
  @ManyToOne(() => SeriesEntity)
  series: SeriesEntity;

  @Field(() => [EpisodeEntity])
  @OneToMany(() => EpisodeEntity, (episode) => episode.season)
  episodes: EpisodeEntity[];
}
