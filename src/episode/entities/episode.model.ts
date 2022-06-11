import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SeasonModel } from '../../season/entities/season.model';
import { SeriesModel } from '../../series/entities/series.model';
import { AgeRestrictionEnum } from '../../shared/age-restriction.enum';

@ObjectType()
@Entity({ name: 'episodes' })
export class EpisodeModel extends BaseEntity {
  @Field()
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
  premierDate?: Date;

  @Field()
  @CreateDateColumn()
  publicationDate!: Date;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  duration?: number;

  @Field(() => Int)
  @Column({ type: 'int' })
  episodeNumber!: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  videoUrl?: string;

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
}
