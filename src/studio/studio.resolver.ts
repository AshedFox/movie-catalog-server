import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StudioService } from './studio.service';
import { CreateStudioInput } from './dto/create-studio.input';
import { UpdateStudioInput } from './dto/update-studio.input';
import { StudioModel } from './entities/studio.model';
import { PaginatedStudios } from './dto/paginated-studios.result';
import { ParseUUIDPipe } from '@nestjs/common';
import { GetStudiosArgs } from './dto/get-studios.args';

@Resolver(StudioModel)
export class StudioResolver {
  constructor(private readonly studioService: StudioService) {}

  @Mutation(() => StudioModel)
  createStudio(@Args('input') createStudioInput: CreateStudioInput) {
    return this.studioService.create(createStudioInput);
  }

  @Query(() => PaginatedStudios)
  getStudios(@Args() { searchName, take, skip }: GetStudiosArgs) {
    return this.studioService.readAll(searchName, take, skip);
  }

  @Query(() => StudioModel, { nullable: true })
  getStudio(@Args('id', ParseUUIDPipe) id: string) {
    return this.studioService.readOne(id);
  }

  @Mutation(() => StudioModel)
  updateStudio(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('input') updateStudioInput: UpdateStudioInput,
  ) {
    return this.studioService.update(id, updateStudioInput);
  }

  @Mutation(() => Boolean)
  deleteStudio(@Args('id', ParseUUIDPipe) id: string) {
    return this.studioService.delete(id);
  }
}
