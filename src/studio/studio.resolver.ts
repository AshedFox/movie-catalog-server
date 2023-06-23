import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { StudioService } from './studio.service';
import { CreateStudioInput } from './dto/create-studio.input';
import { UpdateStudioInput } from './dto/update-studio.input';
import { StudioEntity } from './entities/studio.entity';
import { PaginatedStudios } from './dto/paginated-studios';
import { UseGuards } from '@nestjs/common';
import { GetStudiosArgs } from './dto/get-studios.args';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { MovieTypeEnum, RoleEnum } from '@utils/enums';
import { CountryEntity } from '../country/entities/country.entity';
import { LoadersFactory } from '../dataloader/decorators/loaders-factory.decorator';
import { DataLoaderFactory } from '../dataloader/data-loader.factory';
import { StudioCountryEntity } from '../studio-country/entities/studio-country.entity';
import { Filterable, FilterType } from '@common/filter';
import { Sortable, SortType } from '@common/sort';
import { MovieStudioEntity } from '../movie-studio/entities/movie-studio.entity';
import { MovieEntity } from '../movie/entities/movie.entity';

@Resolver(StudioEntity)
export class StudioResolver {
  constructor(private readonly studioService: StudioService) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => StudioEntity)
  createStudio(@Args('input') createStudioInput: CreateStudioInput) {
    return this.studioService.create(createStudioInput);
  }

  @Query(() => [StudioEntity])
  getAllStudios(
    @Args('filter', { type: () => Filterable(StudioEntity), nullable: true })
    filter?: FilterType<StudioEntity>,
    @Args('sort', { type: () => Sortable(StudioEntity), nullable: true })
    sort?: SortType<StudioEntity>,
  ) {
    return this.studioService.readMany(undefined, sort, filter);
  }

  @Query(() => PaginatedStudios)
  async getStudios(@Args() { sort, filter, ...pagination }: GetStudiosArgs) {
    const [data, count] = await Promise.all([
      this.studioService.readMany(pagination, sort, filter),
      this.studioService.count(filter),
    ]);

    const { limit, offset } = pagination;

    return {
      nodes: data,
      pageInfo: {
        totalCount: count,
        hasNextPage: count > limit + offset,
        hasPreviousPage: offset > 0,
      },
    };
  }

  @Query(() => StudioEntity)
  getStudio(@Args('id', { type: () => Int }) id: number) {
    return this.studioService.readOne(id);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => StudioEntity)
  updateStudio(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') updateStudioInput: UpdateStudioInput,
  ) {
    return this.studioService.update(id, updateStudioInput);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => StudioEntity)
  deleteStudio(@Args('id', { type: () => Int }) id: number) {
    return this.studioService.delete(id);
  }

  @ResolveField(() => [CountryEntity])
  countries(
    @Parent() studio: StudioEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(
        StudioCountryEntity,
        'studioId',
        StudioEntity,
        'id',
        'country',
        CountryEntity,
      )
      .load({ id: studio.id });
  }

  @ResolveField(() => Int)
  moviesCount(
    @Root() studio: StudioEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
    @Args('type', { nullable: true, type: () => MovieTypeEnum })
    type?: MovieTypeEnum,
  ) {
    return loadersFactory
      .createOrGetCountLoader(
        MovieStudioEntity,
        'studioId',
        'movieId',
        type
          ? (qb) =>
              qb
                .leftJoin(MovieEntity, 'movie', 'movie.id = movie_id')
                .andWhere(`movie.type = :type`, { type })
          : undefined,
      )
      .load(studio.id);
  }
}
