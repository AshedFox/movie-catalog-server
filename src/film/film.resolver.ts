import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { FilmEntity } from './entities/film.entity';
import { CreateFilmInput } from './dto/create-film.input';
import { GetFilmsArgs } from './dto/get-films.args';
import { FilmService } from './film.service';
import { UpdateFilmInput } from './dto/update-film.input';
import { PaginatedFilms } from './dto/paginated-films';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '@utils/enums';
import { RolesGuard } from '../auth/guards/roles.guard';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { VideoEntity } from '../video/entities/video.entity';
import { AccessModeEnum } from '@utils/enums/access-mode.enum';
import { MediaService } from '../media/media.service';
import { MediaTypeEnum } from '@utils/enums/media-type.enum';
import { MovieInterfaceResolver } from '../movie/movie-interface.resolver';

@Resolver(FilmEntity)
export class FilmResolver extends MovieInterfaceResolver {
  constructor(
    private readonly filmService: FilmService,
    private readonly mediaService: MediaService,
  ) {
    super();
  }

  @Mutation(() => FilmEntity)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  async createFilm(@Args('input') input: CreateFilmInput) {
    if (input.cover) {
      const media = await this.mediaService.create({
        file: input.cover,
        type: MediaTypeEnum.IMAGE,
      });

      input.coverId = media.id;
      input.cover = undefined;
    }

    return this.filmService.create(input);
  }

  @Query(() => PaginatedFilms)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  async getFilmsProtected(
    @Args() { sort, filter, ...pagination }: GetFilmsArgs,
  ): Promise<PaginatedFilms> {
    const [data, count] = await Promise.all([
      this.filmService.readMany(pagination, sort, filter),
      this.filmService.count(filter),
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

  @Query(() => PaginatedFilms)
  async getFilms(
    @Args() { sort, filter, ...pagination }: GetFilmsArgs,
  ): Promise<PaginatedFilms> {
    filter = {
      ...filter,
      accessMode: { eq: AccessModeEnum.PUBLIC },
    };
    const [data, count] = await Promise.all([
      this.filmService.readMany(pagination, sort, filter),
      this.filmService.count(filter),
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

  @Query(() => FilmEntity)
  getFilm(@Args('id', ParseUUIDPipe) id: string) {
    return this.filmService.readOne(id);
  }

  @Mutation(() => FilmEntity)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  async updateFilm(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('input') input: UpdateFilmInput,
  ) {
    if (input.cover) {
      const media = await this.mediaService.create({
        file: input.cover,
        type: MediaTypeEnum.IMAGE,
      });

      input.coverId = media.id;
      input.cover = undefined;
    }

    return this.filmService.update(id, input);
  }

  @Mutation(() => FilmEntity)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  deleteFilm(@Args('id', ParseUUIDPipe) id: string) {
    return this.filmService.delete(id);
  }

  @ResolveField(() => VideoEntity, { nullable: true })
  video(@Parent() film: FilmEntity, @Context('loaders') loaders: IDataLoaders) {
    return film.videoId ? loaders.videoLoader.load(film.videoId) : undefined;
  }
}
