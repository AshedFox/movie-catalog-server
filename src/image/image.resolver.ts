import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ImageService } from './image.service';
import { ImageModel } from './entities/image.model';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '../user/entities/role.enum';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { FileUpload } from 'graphql-upload';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Resolver(() => ImageModel)
export class ImageResolver {
  constructor(
    private readonly imageService: ImageService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => ImageModel)
  async createImage(
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload,
  ) {
    const { url, height, width } = await this.cloudinaryService.uploadImage(
      file,
    );
    return this.imageService.create({ height, width, url });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Query(() => [ImageModel])
  getImages() {
    return this.imageService.readAll();
  }

  @Query(() => ImageModel)
  getImage(@Args('id', ParseUUIDPipe) id: string) {
    return this.imageService.readOne(id);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => Boolean)
  deleteImage(@Args('id', ParseUUIDPipe) id: string) {
    return this.imageService.delete(id);
  }
}
