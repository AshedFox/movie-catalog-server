import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TrailerService } from './trailer.service';
import { TrailerEntity } from './entities/trailer.entity';
import { CreateTrailerInput } from './dto/create-trailer.input';
import { UpdateTrailerInput } from './dto/update-trailer.input';
import { GetTrailersArgs } from './dto/get-trailers.args';
import { PaginatedTrailers } from './dto/paginated-trailers';

@Resolver(() => TrailerEntity)
export class TrailerResolver {
  constructor(private readonly trailerService: TrailerService) {}

  @Mutation(() => TrailerEntity)
  createTrailer(@Args('input') createTrailerInput: CreateTrailerInput) {
    return this.trailerService.create(createTrailerInput);
  }

  @Query(() => PaginatedTrailers)
  getTrailers(@Args() { pagination, sort, filter }: GetTrailersArgs) {
    return this.trailerService.readMany(pagination, sort, filter);
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

  @Mutation(() => Boolean)
  deleteTrailer(@Args('id', { type: () => Int }) id: number) {
    return this.trailerService.delete(id);
  }
}
