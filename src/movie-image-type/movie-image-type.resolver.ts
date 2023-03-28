import { MovieImageTypeEntity } from './entities/movie-image-type.entity';
import { MovieImageTypeService } from './movie-image-type.service';
import { GetMovieImageTypesArgs } from './dto/get-movie-image-types.args';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RoleEnum } from '@utils/enums';
import { CreateMovieImageTypeInput } from './dto/create-movie-image-type.input';
import { UpdateMovieImageTypeInput } from './dto/update-movie-image-type.input';
import { PaginatedMovieImageTypes } from './dto/paginated-movie-image-types';

@Resolver(() => MovieImageTypeEntity)
export class MovieImageTypeResolver {
  constructor(private readonly movieImageTypeService: MovieImageTypeService) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => MovieImageTypeEntity)
  createMovieImageType(
    @Args('input') createMovieImageTypeInput: CreateMovieImageTypeInput,
  ) {
    return this.movieImageTypeService.create(createMovieImageTypeInput);
  }

  @Query(() => PaginatedMovieImageTypes)
  async getMovieImageTypes(
    @Args() { sort, filter, ...pagination }: GetMovieImageTypesArgs,
  ) {
    const [data, count] = await Promise.all([
      this.movieImageTypeService.readMany(pagination, sort, filter),
      this.movieImageTypeService.count(filter),
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

  @Query(() => MovieImageTypeEntity)
  getMovieImageType(@Args('id', { type: () => Int }) id: number) {
    return this.movieImageTypeService.readOne(id);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => MovieImageTypeEntity)
  updateMovieImageType(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') updateMovieImageTypeInput: UpdateMovieImageTypeInput,
  ) {
    return this.movieImageTypeService.update(id, updateMovieImageTypeInput);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => MovieImageTypeEntity)
  deleteMovieImageType(@Args('id', { type: () => Int }) id: number) {
    return this.movieImageTypeService.delete(id);
  }
}
