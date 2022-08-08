import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { VideoService } from './video.service';
import { VideoEntity } from './entities/video.entity';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '../utils/enums/role.enum';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FileUpload } from 'graphql-upload';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { ImageEntity } from '../image/entities/image.entity';
import { IDataLoaders } from '../dataloader/idataloaders.interface';

@Resolver(() => VideoEntity)
export class VideoResolver {
  constructor(
    private readonly videoService: VideoService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => VideoEntity)
  async createVideo(
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload,
  ) {
    const { url, height, width } = await this.cloudinaryService.uploadVideo(
      file,
    );
    return this.videoService.create({ url, height, width });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Query(() => [VideoEntity])
  getVideos() {
    return this.videoService.readMany();
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Query(() => VideoEntity)
  getVideo(@Args('id', ParseUUIDPipe) id: string) {
    return this.videoService.readOne(id);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => Boolean)
  deleteVideo(@Args('id') id: string) {
    return this.videoService.delete(id);
  }

  @ResolveField(() => ImageEntity)
  preview(
    @Parent() video: VideoEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.imageLoader.load(video.id);
  }
}
