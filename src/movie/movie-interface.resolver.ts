import {
  Context,
  Float,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { MovieEntity } from './entities/movie.entity';
import { MediaEntity } from '../media/entities/media.entity';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { MoviePersonEntity } from '../movie-person/entities/movie-person.entity';
import { GenreEntity } from '../genre/entities/genre.entity';
import { StudioEntity } from '../studio/entities/studio.entity';
import { MovieImageEntity } from '../movie-image/entities/movie-image.entity';
import { TrailerEntity } from '../trailer/entities/trailer.entity';
import { MovieReviewEntity } from '../movie-review/entities/movie-review.entity';
import { CountryEntity } from '../country/entities/country.entity';
import { CollectionEntity } from '../collection/entities/collection.entity';

@Resolver(MovieEntity)
export class MovieInterfaceResolver {
  @ResolveField(() => MediaEntity, { nullable: true })
  cover(
    @Parent() movie: MovieEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return movie.coverId ? loaders.mediaLoader.load(movie.coverId) : undefined;
  }

  @ResolveField(() => [TrailerEntity])
  trailers(
    @Parent() movie: MovieEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.trailersByMovieLoader.load(movie.id);
  }

  @ResolveField(() => [MovieReviewEntity])
  reviews(
    @Parent() movie: MovieEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.movieReviewsByMovieLoader.load(movie.id);
  }

  @ResolveField(() => [MoviePersonEntity])
  moviePersons(
    @Parent() movie: MovieEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.moviePersonsByMovieLoader.load(movie.id);
  }

  @ResolveField(() => [MovieImageEntity])
  movieImages(
    @Parent() movie: MovieEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.movieImagesByMovieLoader.load(movie.id);
  }

  @ResolveField(() => [GenreEntity])
  genres(
    @Parent() movie: MovieEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.genresByMovieLoader.load(movie.id);
  }

  @ResolveField(() => [CountryEntity])
  countries(
    @Parent() movie: MovieEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.countriesByMovieLoader.load(movie.id);
  }

  @ResolveField(() => [StudioEntity])
  studios(
    @Parent() movie: MovieEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.studiosByMovieLoader.load(movie.id);
  }

  @ResolveField(() => Float)
  async rating(
    @Parent() movie: MovieEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    if (!movie.reviews) {
      movie.reviews = await loaders.movieReviewsByMovieLoader.load(movie.id);
    }
    return movie.reviews.length > 0
      ? movie.reviews.reduce((prev, curr) => {
          return prev + curr.mark;
        }, 0) / movie.reviews.length
      : 0;
  }

  @ResolveField(() => [CollectionEntity])
  collections(
    @Parent() movie: MovieEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.collectionsByMovieLoader.load(movie.id);
  }
}