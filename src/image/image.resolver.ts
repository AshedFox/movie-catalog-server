import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ImageService } from './image.service';
import { CreateImageInput } from './dto/create-image.input';
import { UpdateImageInput } from './dto/update-image.input';
import { ImageModel } from './entities/image.model';
import { ParseUUIDPipe } from '@nestjs/common';

@Resolver(() => ImageModel)
export class ImageResolver {
  constructor(private readonly imageService: ImageService) {}

  @Mutation(() => ImageModel)
  createImage(@Args('input') input: CreateImageInput) {
    return this.imageService.create(input);
  }

  @Query(() => [ImageModel])
  getImages() {
    return this.imageService.readAll();
  }

  @Query(() => ImageModel)
  getImage(@Args('id', ParseUUIDPipe) id: string) {
    return this.imageService.readOne(id);
  }

  @Mutation(() => ImageModel)
  updateImage(@Args('id') id: string, @Args('input') input: UpdateImageInput) {
    return this.imageService.update(id, input);
  }

  @Mutation(() => Boolean)
  deleteImage(@Args('id', ParseUUIDPipe) id: string) {
    return this.imageService.delete(id);
  }
}
