import { Field, ObjectType } from '@nestjs/graphql';
import { ChildEntity, Column, Index, OneToMany } from 'typeorm';
import { SeasonEntity } from '../../season/entities/season.entity';
import { EpisodeEntity } from '../../episode/entities/episode.entity';
import { MovieTypeEnum } from '@utils/enums';
import { MovieEntity } from '../../movie/entities/movie.entity';
import { FilterableField } from '@common/filter';

@ObjectType('Series', {
  implements: [MovieEntity],
})
@ChildEntity(MovieTypeEnum.Series)
export class SeriesEntity extends MovieEntity {
  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  @Index({ where: 'start_release_date IS NOT NULL' })
  startReleaseDate?: Date;

  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  @Index({ where: 'end_release_date IS NOT NULL' })
  endReleaseDate?: Date;

  @Field(() => [SeasonEntity])
  @OneToMany(() => SeasonEntity, (season) => season.series)
  seasons: SeasonEntity[];

  @Field(() => [EpisodeEntity])
  @OneToMany(() => EpisodeEntity, (episode) => episode.series)
  episodes: EpisodeEntity[];
}
