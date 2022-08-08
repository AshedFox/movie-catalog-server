import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ChildEntity, Column, OneToMany } from 'typeorm';
import { SeasonEntity } from '../../season/entities/season.entity';
import { EpisodeEntity } from '../../episode/entities/episode.entity';
import { MovieTypeEnum } from '../../utils/enums/movie-type.enum';
import { MovieEntity } from '../../movie/entities/movie.entity';

@ObjectType()
@ChildEntity(MovieTypeEnum.Series)
export class SeriesEntity extends MovieEntity {
  @Field({ nullable: true })
  @Column({ nullable: true })
  startReleaseDate?: Date;

  @Field({ nullable: true })
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
