import {
  Args,
  Context,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { MovieImageService } from './movie-image.service';
import { CreateMovieImageInput } from './dto/create-movie-image.input';
import { UpdateMovieImageInput } from './dto/update-movie-image.input';
import { MovieImageEntity } from './entities/movie-image.entity';
import { UseGuards } from '@nestjs/common';
import { GetMoviesImagesArgs } from './dto/get-movies-images.args';
import { PaginatedMoviesImages } from './dto/paginated-movies-images';
import { MovieEntity } from '../movie/entities/movie.entity';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { ImageEntity } from '../image/entities/image.entity';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '@utils/enums';

@Resolver(MovieImageEntity)
export class MovieImageResolver {
  constructor(private readonly movieImageService: MovieImageService) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => MovieImageEntity)
  createMovieImage(
    @Args('input') createMovieImageInput: CreateMovieImageInput,
  ) {
    return this.movieImageService.create(createMovieImageInput);
  }

  @Query(() => PaginatedMoviesImages)
  getMoviesImages(@Args() { pagination, sort, filter }: GetMoviesImagesArgs) {
    return this.movieImageService.readMany(pagination, sort, filter);
  }

  @Query(() => MovieImageEntity)
  getMovieImage(@Args('id', { type: () => Int }) id: number) {
    return this.movieImageService.readOne(id);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => MovieImageEntity)
  updateMovieImage(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') updateMovieImageInput: UpdateMovieImageInput,
  ) {
    return this.movieImageService.update(id, updateMovieImageInput);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => Boolean)
  deleteMovieImage(@Args('id', { type: () => Int }) id: number) {
    return this.movieImageService.delete(id);
  }

  @ResolveField(() => MovieEntity)
  movie(
    @Parent() movieImage: MovieImageEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.movieLoader.load(movieImage.movieId);
  }

  @ResolveField(() => ImageEntity)
  image(
    @Parent() movieImage: MovieImageEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.imageLoader.load(movieImage.imageId);
  }
}
