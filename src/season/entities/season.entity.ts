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
import { SeriesEntity } from '../../series/entities/series.entity';
import { EpisodeEntity } from '../../episode/entities/episode.entity';
import { AgeRestrictionEnum } from '../../utils/enums/age-restriction.enum';
import { AccessModeEnum } from '../../utils/enums/access-mode.enum';

@ObjectType()
@Entity({ name: 'seasons' })
@Unique(['numberInSeries', 'seriesId'])
export class SeasonEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Int)
  @Column({ type: 'int' })
  numberInSeries: number;

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
  startReleaseDate?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  endReleaseDate?: Date;

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
  episodesCount: number;

  @Field()
  @Column()
  seriesId: string;

  @Field(() => SeriesEntity)
  @ManyToOne(() => SeriesEntity)
  series: SeriesEntity;

  @Field(() => [EpisodeEntity])
  @OneToMany(() => EpisodeEntity, (episode) => episode.season)
  episodes: EpisodeEntity[];
}
