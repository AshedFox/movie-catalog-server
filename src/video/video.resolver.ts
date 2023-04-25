import {
  Args,
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
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '@utils/enums';
import { PaginatedVideos } from './dto/paginated-videos';
import { GetVideosArgs } from './dto/get-videos.args';
import { VideoVariantEntity } from '../video-variant/entities/video-variant.entity';
import { SubtitlesEntity } from '../subtitles/entities/subtitles.entity';
import { LoadersFactory } from '../dataloader/decorators/loaders-factory.decorator';
import { DataLoaderFactory } from '../dataloader/data-loader.factory';

@Resolver(() => VideoEntity)
export class VideoResolver {
  constructor(private readonly videoService: VideoService) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => VideoEntity)
  createVideo(@Args('input') input: CreateVideoInput) {
    return this.videoService.create(input);
  }

  @Query(() => PaginatedVideos)
  async getVideos(@Args() { sort, filter, ...pagination }: GetVideosArgs) {
    const [data, count] = await Promise.all([
      this.videoService.readMany(pagination, sort, filter),
      this.videoService.count(filter),
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

  @Query(() => VideoEntity)
  getVideo(@Args('id', { type: () => Int }) id: number) {
    return this.videoService.readOne(id);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => VideoEntity)
  removeVideo(@Args('id', { type: () => Int }) id: number) {
    return this.videoService.delete(id);
  }

  @ResolveField(() => [VideoVariantEntity])
  variants(
    @Parent() video: VideoEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(VideoVariantEntity, 'videoId', VideoEntity, 'id')
      .load({ id: video.id });
  }

  @ResolveField(() => [VideoAudioEntity])
  audios(
    @Parent() video: VideoEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(VideoAudioEntity, 'videoId', VideoEntity, 'id')
      .load({ id: video.id });
  }

  @ResolveField(() => [SubtitlesEntity])
  subtitles(
    @Parent() video: VideoEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(SubtitlesEntity, 'videoId', VideoEntity, 'id')
      .load({ id: video.id });
  }
}
