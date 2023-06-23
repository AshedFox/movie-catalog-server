import {
  Args,
  Int,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { GenreService } from './genre.service';
import { CreateGenreInput } from './dto/create-genre.input';
import { UpdateGenreInput } from './dto/update-genre.input';
import { GenreEntity } from './entities/genre.entity';
import { PaginatedGenres } from './dto/paginated-genres';
import { GetGenresArgs } from './dto/get-genres.args';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { MovieTypeEnum, RoleEnum } from '@utils/enums';
import { Filterable, FilterType } from '@common/filter';
import { Sortable, SortType } from '@common/sort';
import { LoadersFactory } from '../dataloader/decorators/loaders-factory.decorator';
import { DataLoaderFactory } from '../dataloader/data-loader.factory';
import { MovieGenreEntity } from '../movie-genre/entities/movie-genre.entity';
import { MovieEntity } from '../movie/entities/movie.entity';

@Resolver(GenreEntity)
export class GenreResolver {
  constructor(private readonly genreService: GenreService) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => GenreEntity)
  createGenre(@Args('input') createGenreInput: CreateGenreInput) {
    return this.genreService.create(createGenreInput);
  }

  @Query(() => [GenreEntity])
  getAllGenres(
    @Args('filter', { type: () => Filterable(GenreEntity), nullable: true })
    filter?: FilterType<GenreEntity>,
    @Args('sort', { type: () => Sortable(GenreEntity), nullable: true })
    sort?: SortType<GenreEntity>,
  ) {
    return this.genreService.readMany(undefined, sort, filter);
  }

  @Query(() => PaginatedGenres)
  async getGenres(
    @Args() { sort, filter, ...pagination }: GetGenresArgs,
  ): Promise<PaginatedGenres> {
    const [data, count] = await Promise.all([
      this.genreService.readMany(pagination, sort, filter),
      this.genreService.count(filter),
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

  @Query(() => GenreEntity)
  getGenre(@Args('id', ParseUUIDPipe) id: string) {
    return this.genreService.readOne(id);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => GenreEntity)
  updateGenre(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('input') updateGenreInput: UpdateGenreInput,
  ) {
    return this.genreService.update(id, updateGenreInput);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => GenreEntity)
  deleteGenre(@Args('id', ParseUUIDPipe) id: string) {
    return this.genreService.delete(id);
  }

  @ResolveField(() => Int)
  moviesCount(
    @Root() genre: GenreEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
    @Args('type', { nullable: true, type: () => MovieTypeEnum })
    type?: MovieTypeEnum,
  ) {
    return loadersFactory
      .createOrGetCountLoader(
        MovieGenreEntity,
        'genreId',
        'movieId',
        type
          ? (qb) =>
              qb
                .leftJoin(MovieEntity, 'movie', 'movie.id = movie_id')
                .andWhere(`movie.type = :type`, { type })
          : undefined,
      )
      .load(genre.id);
  }
}
