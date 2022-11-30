import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ChildEntity, Column, OneToMany } from 'typeorm';
import { SeasonEntity } from '../../season/entities/season.entity';
import { EpisodeEntity } from '../../episode/entities/episode.entity';
import { MovieTypeEnum } from '@utils/enums';
import { MovieEntity } from '../../movie/entities/movie.entity';
import { FilterableField } from '@common/filter';

@ObjectType()
@ChildEntity(MovieTypeEnum.Series)
export class SeriesEntity extends MovieEntity {
  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  startReleaseDate?: Date;

  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  endReleaseDate?: Date;

  @Field(() => Int)
  episodesCount: number;

  @Field(() => Int)
  seasonsCount?: number;

  @Field(() => [SeasonEntity])
  @OneToMany(() => SeasonEntity, (season) => season.series)
  seasons: SeasonEntity[];

  @Field(() => [EpisodeEntity])
  @OneToMany(() => EpisodeEntity, (episode) => episode.series)
  episodes: EpisodeEntity[];
}
