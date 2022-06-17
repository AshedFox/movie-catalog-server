import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GenreModel } from '../../genre/entities/genre.model';
import { StudioModel } from '../../studio/entities/studio.model';
import { SeasonModel } from '../../season/entities/season.model';
import { SeriesPersonModel } from '../../series-person/entities/series-person.model';
import { EpisodeModel } from '../../episode/entities/episode.model';
import { AgeRestrictionEnum } from '../../shared/age-restriction.enum';

@ObjectType()
@Entity({ name: 'series' })
export class SeriesModel {
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

  @Field()
  @Column()
  premierDate!: Date;

  @Field()
  @CreateDateColumn()
  publicationDate!: Date;

  @Field(() => [GenreModel])
  @ManyToMany(() => GenreModel, { lazy: true })
  @JoinTable({ name: 'series_genres' })
  genres!: Promise<GenreModel[]>;

  @Field(() => [StudioModel])
  @ManyToMany(() => StudioModel, { lazy: true })
  @JoinTable({ name: 'series_studios' })
  studios!: Promise<StudioModel[]>;

  @Field(() => [SeriesPersonModel])
  @OneToMany(() => SeriesPersonModel, (seriesPerson) => seriesPerson.series, {
    lazy: true,
  })
  persons!: Promise<SeriesPersonModel[]>;

  @Field(() => [SeasonModel])
  @OneToMany(() => SeasonModel, (season) => season.series, { lazy: true })
  seasons!: Promise<SeasonModel[]>;

  @Field(() => [EpisodeModel])
  @OneToMany(() => EpisodeModel, (episode) => episode.series, { lazy: true })
  episodes!: Promise<EpisodeModel[]>;
}
