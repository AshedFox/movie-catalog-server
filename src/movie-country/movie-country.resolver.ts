import {
  Args,
  Context,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { MovieCountryService } from './movie-country.service';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { MovieEntity } from '../movie/entities/movie.entity';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { MovieCountryEntity } from './entities/movie-country.entity';
import { CountryEntity } from '../country/entities/country.entity';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '@utils/enums';

@Resolver(() => MovieCountryEntity)
export class MovieCountryResolver {
  constructor(private readonly movieCountryService: MovieCountryService) {}

  @Mutation(() => MovieCountryEntity)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  createMovieCountry(
    @Args('movieId', ParseUUIDPipe) movieId: string,
    @Args('countryId') countryId: string,
  ) {
    return this.movieCountryService.create(movieId, countryId);
  }

  @Mutation(() => MovieEntity)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
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
