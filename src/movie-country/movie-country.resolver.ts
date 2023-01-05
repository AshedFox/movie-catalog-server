import {
  Args,
  Context,
  Int,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { MovieCountryService } from './movie-country.service';
import { ParseUUIDPipe } from '@nestjs/common';
import { MovieEntity } from '../movie/entities/movie.entity';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { MovieCountryEntity } from './entities/movie-country.entity';
import { CountryEntity } from '../country/entities/country.entity';

@Resolver(() => MovieCountryEntity)
export class MovieCountryResolver {
  constructor(private readonly movieCountryService: MovieCountryService) {}

  @Mutation(() => MovieCountryEntity)
  createMovieCountry(
    @Args('movieId', ParseUUIDPipe) movieId: string,
    @Args('countryId') countryId: string,
  ) {
    return this.movieCountryService.create(movieId, countryId);
  }

  @Mutation(() => Boolean)
  deleteMovieCountry(
    @Args('movieId', ParseUUIDPipe) movieId: string,
    @Args('countryId') countryId: string,
  ) {
    return this.movieCountryService.delete(movieId, countryId);
  }

  @ResolveField(() => MovieEntity)
  movie(
    @Parent() movieCountry: MovieCountryEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.movieLoader.load(movieCountry.movieId);
  }

  @ResolveField(() => CountryEntity)
  country(
    @Parent() movieCountry: MovieCountryEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.countryLoader.load(movieCountry.countryId);
  }
}
