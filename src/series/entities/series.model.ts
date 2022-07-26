import { Field, HideField, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GenreModel } from '../../genre/entities/genre.model';
import { StudioModel } from '../../studio/entities/studio.model';
import { SeasonModel } from '../../season/entities/season.model';
import { SeriesPersonModel } from '../../series-person/entities/series-person.model';
import { EpisodeModel } from '../../episode/entities/episode.model';
import { AgeRestrictionEnum } from '../../shared/age-restriction.enum';
import { SeriesGenreModel } from '../../series-genre/entities/series-genre.model';
import { SeriesStudioModel } from '../../series-studio/entities/series-studio.model';
import { SeriesPosterModel } from '../../series-poster/entities/series-poster.model';
import { ImageModel } from '../../image/entities/image.model';
import { AccessModeEnum } from '../../shared/access-mode.enum';

@ObjectType()
@Entity({ name: 'series' })
export class SeriesModel {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column()
  title!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field(() => AgeRestrictionEnum)
  @Column({ type: 'enum', enum: AgeRestrictionEnum })
  ageRestriction!: AgeRestrictionEnum;

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

  @Field(() => Int)
  seasonsCount?: number;

  @Field(() => [ImageModel])
  posters!: ImageModel[];

  @HideField()
  @OneToMany(() => SeriesPosterModel, (seriesPoster) => seriesPoster.series)
  postersConnection!: SeriesPosterModel[];

  @Field(() => [GenreModel])
  genres!: GenreModel[];

  @HideField()
  @OneToMany(() => SeriesGenreModel, (seriesGenre) => seriesGenre.series)
  genresConnection!: SeriesGenreModel[];

  @Field(() => [StudioModel])
  studios!: StudioModel[];

  @HideField()
  @OneToMany(() => SeriesStudioModel, (seriesStudio) => seriesStudio.series)
  studiosConnection!: SeriesStudioModel[];

  @Field(() => [SeriesPersonModel])
  @OneToMany(() => SeriesPersonModel, (seriesPerson) => seriesPerson.series)
  seriesPersons!: SeriesPersonModel[];

  @Field(() => [SeasonModel])
  @OneToMany(() => SeasonModel, (season) => season.series)
  seasons!: SeasonModel[];

  @Field(() => [EpisodeModel])
  @OneToMany(() => EpisodeModel, (episode) => episode.series)
  episodes!: EpisodeModel[];
}
