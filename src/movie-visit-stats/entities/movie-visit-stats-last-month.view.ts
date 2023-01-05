import { Index, ManyToOne, ViewColumn, ViewEntity } from 'typeorm';
import { MovieVisitStatsEntity } from './movie-visit-stats.entity';
import { MovieEntity } from '../../movie/entities/movie.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { FilterableField, FilterableRelation } from '@common/filter';

@ObjectType('MovieVisitStatsLastMonth')
@ViewEntity({
  name: 'movies_visits_stats_last_month',
  materialized: true,
  dependsOn: [() => MovieVisitStatsEntity],
  expression: `SELECT * FROM "movies_visits_stats" WHERE "created_at" >= date_trunc('day',(now() - interval '1 month'))`,
})
export class MovieVisitStatsLastMonthView {
  @Field()
  @ViewColumn()
  id: number;

  @FilterableField()
  @ViewColumn()
  @Index()
  movieId: string;

  @FilterableRelation(() => MovieEntity)
  @ManyToOne(() => MovieEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  movie: MovieEntity;

  @FilterableField()
  @ViewColumn()
  @Index()
  createdAt: Date;
}
