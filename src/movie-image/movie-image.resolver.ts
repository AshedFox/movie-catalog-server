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
import { MediaEntity } from '../media/entities/media.entity';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '@utils/enums';
import { MovieImageTypeEntity } from '../movie-image-type/entities/movie-image-type.entity';

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
  async getMoviesImages(
    @Args() { sort, filter, ...pagination }: GetMoviesImagesArgs,
  ) {
    const [data, count] = await Promise.all([
      this.movieImageService.readMany(pagination, sort, filter),
      this.movieImageService.count(filter),
    ]);

    const { take, skip } = pagination;

    return {
      nodes: data,
      pageInfo: {
        totalCount: count,
        hasNextPage: count > take + skip,
        hasPreviousPage: skip > 0,
      },
    };
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
  @Mutation(() => MovieImageEntity)
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

  @ResolveField(() => MediaEntity)
  image(
    @Parent() movieImage: MovieImageEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.mediaLoader.load(movieImage.imageId);
  }

  @ResolveField(() => MovieImageTypeEntity)
  type(
    @Parent() movieImage: MovieImageEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.movieImageTypeLoader.load(movieImage.typeId);
  }
}
