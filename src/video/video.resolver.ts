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
import { CreateVideoInput } from './dto/create-video.input';
import { VideoModel } from './entities/video.model';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '../user/entities/role.enum';
import { UpdateVideoInput } from './dto/update-video.input';
import { QualityModel } from '../quality/entities/quality.model';
import { IDataLoaders } from '../dataloader/idataloaders.interface';

@Resolver(() => VideoModel)
export class VideoResolver {
  constructor(private readonly videoService: VideoService) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => VideoModel)
  createVideo(@Args('input') input: CreateVideoInput) {
    return this.videoService.create(input);
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
  @Mutation(() => VideoModel)
  updateVideo(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('input') input: UpdateVideoInput,
  ) {
    return this.videoService.update(id, input);
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
