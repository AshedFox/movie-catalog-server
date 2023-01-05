import { createUnionType } from '@nestjs/graphql';
import { FilmEntity } from '../../film/entities/film.entity';
import { SeriesEntity } from '../../series/entities/series.entity';
import { MovieEntity } from './movie.entity';
import { MovieTypeEnum } from '@utils/enums';

export const MovieUnion = createUnionType({
  name: 'MovieUnion',
  types: () => [FilmEntity, SeriesEntity] as const,
  resolveType(value: MovieEntity) {
    if (value.type === MovieTypeEnum.Film) {
      return FilmEntity;
    } else if (value.type === MovieTypeEnum.Series) {
      return SeriesEntity;
    }
    return null;
  },
});
