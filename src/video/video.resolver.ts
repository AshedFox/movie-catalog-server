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
import { VideoModel } from './entities/video.model';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '../user/entities/role.enum';
import { QualityModel } from '../quality/entities/quality.model';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FileUpload } from 'graphql-upload';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

@Resolver(() => VideoModel)
export class VideoResolver {
  constructor(
    private readonly videoService: VideoService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => VideoModel)
  async createVideo(
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload,
  ) {
    const { url, height, width } = await this.cloudinaryService.uploadVideo(
      file,
    );
    return this.videoService.create({ baseUrl: url, height, width });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Query(() => [VideoModel])
  getVideos() {
    return this.videoService.readAll();
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Query(() => VideoModel)
  getVideo(@Args('id', ParseUUIDPipe) id: string) {
    return this.videoService.readOne(id);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => Boolean)
  deleteVideo(@Args('id') id: string) {
    return this.videoService.delete(id);
  }

  @ResolveField(() => [QualityModel])
  qualities(
    @Parent() video: VideoModel,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.qualitiesByVideoLoader.load(video.id);
  }
}
