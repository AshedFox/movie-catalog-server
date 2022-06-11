import { Field, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
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
export class SeriesModel extends BaseEntity {
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

  @Field()
  @Column()
  premierDate!: Date;

  @Field()
  @CreateDateColumn()
  publicationDate!: Date;

  @Field(() => [GenreModel])
  @ManyToMany(() => GenreModel)
  @JoinTable({ name: 'series_genres' })
  genres!: GenreModel[];

  @Field(() => [StudioModel])
  @ManyToMany(() => StudioModel)
  @JoinTable({ name: 'series_studios' })
  studios!: StudioModel[];

  @Field(() => [SeriesPersonModel])
  @OneToMany(() => SeriesPersonModel, (seriesPerson) => seriesPerson.series)
  persons!: SeriesPersonModel[];

  @Field(() => [SeasonModel])
  @OneToMany(() => SeasonModel, (season) => season.series)
  seasons!: SeasonModel[];

  @Field(() => [EpisodeModel])
  @OneToMany(() => EpisodeModel, (episode) => episode.series)
  episodes!: EpisodeModel[];
}
