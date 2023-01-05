import {
  Args,
  Context,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { VideoService } from './video.service';
import { VideoEntity } from './entities/video.entity';
import { CreateVideoInput } from './dto/create-video.input';
import { UpdateVideoInput } from './dto/update-video.input';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '@utils/enums';
import { PaginatedVideos } from './dto/paginated-videos';
import { GetVideosArgs } from './dto/get-videos.args';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { MediaEntity } from '../media/entities/media.entity';

@UseGuards(GqlJwtAuthGuard, RolesGuard)
@Role([RoleEnum.Admin, RoleEnum.Moderator])
@Resolver(() => VideoEntity)
export class VideoResolver {
  constructor(private readonly videoService: VideoService) {}

  @Mutation(() => VideoEntity)
  createVideo(@Args('input') input: CreateVideoInput) {
    return this.videoService.create(input);
  }

  @Query(() => PaginatedVideos)
  getVideos(@Args() { pagination, filter, sort }: GetVideosArgs) {
    return this.videoService.readMany(pagination, sort, filter);
  }

  @Query(() => VideoEntity)
  getVideo(@Args('id', { type: () => Int }) id: number) {
    return this.videoService.readOne(id);
  }

  @Mutation(() => VideoEntity)
  updateVideo(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateVideoInput,
  ) {
    return this.videoService.update(id, input);
  }

  @Mutation(() => VideoEntity)
  removeVideo(@Args('id', { type: () => Int }) id: number) {
    return this.videoService.delete(id);
  }

  @ResolveField(() => MediaEntity)
  file(
    @Parent() video: VideoEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.mediaLoader.load(video.fileId);
  }
}
