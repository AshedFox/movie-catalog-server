import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RoleEnum } from '@utils/enums';
import { MoviePersonTypeService } from './movie-person-type.service';
import { UpdateMoviePersonTypeInput } from './dto/update-movie-person-type.input';
import { MoviePersonTypeEntity } from './entities/movie-person-type.entity';
import { GetMoviePersonTypesArgs } from './dto/get-movie-person-types.args';
import { CreateMoviePersonTypeInput } from './dto/create-movie-person-type.input';
import { PaginatedMoviePersonTypes } from './dto/paginated-movie-person-types';

@Resolver(() => MoviePersonTypeEntity)
export class MoviePersonTypeResolver {
  constructor(
    private readonly moviePersonTypeService: MoviePersonTypeService,
  ) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => MoviePersonTypeEntity)
  createMoviePersonType(
    @Args('input') createMoviePersonTypeInput: CreateMoviePersonTypeInput,
  ) {
    return this.moviePersonTypeService.create(createMoviePersonTypeInput);
  }

  @Query(() => PaginatedMoviePersonTypes)
  async getMoviePersonTypes(
    @Args() { sort, filter, ...pagination }: GetMoviePersonTypesArgs,
  ) {
    const [data, count] = await Promise.all([
      this.moviePersonTypeService.readMany(pagination, sort, filter),
      this.moviePersonTypeService.count(filter),
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

  @Query(() => MoviePersonTypeEntity)
  getMoviePersonType(@Args('id', { type: () => Int }) id: number) {
    return this.moviePersonTypeService.readOne(id);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => MoviePersonTypeEntity)
  updateMoviePersonType(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') updateMoviePersonTypeInput: UpdateMoviePersonTypeInput,
  ) {
    return this.moviePersonTypeService.update(id, updateMoviePersonTypeInput);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => MoviePersonTypeEntity)
  deleteMoviePersonType(@Args('id', { type: () => Int }) id: number) {
    return this.moviePersonTypeService.delete(id);
  }
}
