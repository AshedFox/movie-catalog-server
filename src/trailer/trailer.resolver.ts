import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { TrailerService } from './trailer.service';
import { TrailerEntity } from './entities/trailer.entity';
import { CreateTrailerInput } from './dto/create-trailer.input';
import { UpdateTrailerInput } from './dto/update-trailer.input';
import { GetTrailersArgs } from './dto/get-trailers.args';
import { PaginatedTrailers } from './dto/paginated-trailers';
import { MovieEntity } from '../movie/entities/movie.entity';
import { LoadersFactory } from '../dataloader/decorators/loaders-factory.decorator';
import { DataLoaderFactory } from '../dataloader/data-loader.factory';
import { VideoEntity } from '../video/entities/video.entity';

@Resolver(() => TrailerEntity)
export class TrailerResolver {
  constructor(private readonly trailerService: TrailerService) {}

  @Mutation(() => TrailerEntity)
  createTrailer(@Args('input') createTrailerInput: CreateTrailerInput) {
    return this.trailerService.create(createTrailerInput);
  }

  @Query(() => PaginatedTrailers)
  async getTrailers(@Args() { sort, filter, ...pagination }: GetTrailersArgs) {
    const [data, count] = await Promise.all([
      this.trailerService.readMany(pagination, sort, filter),
      this.trailerService.count(filter),
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

  @Query(() => TrailerEntity)
  getTrailer(@Args('id', { type: () => Int }) id: number) {
    return this.trailerService.readOne(id);
  }

  @Mutation(() => TrailerEntity)
  updateTrailer(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') updateTrailerInput: UpdateTrailerInput,
  ) {
    return this.trailerService.update(id, updateTrailerInput);
  }

  @Mutation(() => TrailerEntity)
  deleteTrailer(@Args('id', { type: () => Int }) id: number) {
    return this.trailerService.delete(id);
  }

  @ResolveField(() => MovieEntity)
  movie(
    @Parent() trailer: TrailerEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(MovieEntity, 'id')
      .load(trailer.movieId);
  }

  @ResolveField(() => VideoEntity)
  video(
    @Parent() trailer: TrailerEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(VideoEntity, 'id')
      .load(trailer.videoId);
  }
}
