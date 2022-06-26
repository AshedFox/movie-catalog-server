import {
  Args,
  Context,
  Int,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { VideoQualityService } from './video-quality.service';
import { VideoQualityModel } from './entities/video-quality.model';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '../user/entities/role.enum';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { VideoModel } from '../video/entities/video.model';
import { QualityModel } from '../quality/entities/quality.model';

@Resolver(() => VideoQualityModel)
export class VideoQualityResolver {
  constructor(private readonly videoQualityService: VideoQualityService) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => VideoQualityModel)
  createVideoQuality(
    @Args('videoId', ParseUUIDPipe) videoId: string,
    @Args('qualityId', { type: () => Int }) qualityId: number,
  ) {
    return this.videoQualityService.create(videoId, qualityId);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => Boolean)
  deleteVideoQuality(
    @Args('videoId', ParseUUIDPipe) videoId: string,
    @Args('qualityId', { type: () => Int }) qualityId: number,
  ) {
    return this.videoQualityService.delete(videoId, qualityId);
  }

  @ResolveField(() => VideoModel)
  video(
    @Parent() videoQuality: VideoQualityModel,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.videoLoader.load(videoQuality.videoId);
  }

  @ResolveField(() => QualityModel)
  quality(
    @Parent() videoQuality: VideoQualityModel,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.qualityLoader.load(videoQuality.qualityId);
  }
}
