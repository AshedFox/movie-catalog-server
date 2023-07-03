import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { VideoService } from './video.service';
import { VideoEntity } from './entities/video.entity';
import { Inject, UseGuards } from '@nestjs/common';
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
import { PubSub } from 'graphql-subscriptions';
import { MediaEntity } from '../media/entities/media.entity';
import { VideoAudioEntity } from '../video-audio/entities/video-audio.entity';
import { join } from 'path';
import fs from 'fs';

@Resolver(() => VideoEntity)
export class VideoResolver {
  constructor(
    private readonly videoService: VideoService,
    @Inject('PUB_SUB')
    private readonly pubSub: PubSub,
  ) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin])
  @Mutation(() => Boolean)
  generateStreamingForVideo(@Args('id', { type: () => Int }) id: number) {
    this.videoService
      .prepareStreamingData(id)
      .then(async (data) => {
        const streamingOutDir = join(
          process.cwd(),
          'assets',
          `video_${id}`,
          'streaming',
        );

        try {
          await this.pubSub.publish(
            `streamingGenerationProgress_${id}`,
            `Starting streaming files creation for video ${id}`,
          );

          await this.videoService.createStreaming(
            id,
            join(process.cwd(), 'assets', `video_${id}`, 'streaming'),
            data.videoVariants,
            data.audioVariants,
            data.subtitles,
          );

          await this.pubSub.publish(
            `streamingGenerationProgress_${id}`,
            `Successfully created streaming files for video ${id}`,
          );

          await this.pubSub.publish(
            `streamingGenerationProgress_${id}`,
            `Clearing old streaming files if exists for video ${id}`,
          );

          await this.videoService.clearStreamingFiles(id);

          await this.pubSub.publish(
            `streamingGenerationProgress_${id}`,
            `Starting uploading streaming files for video ${id}`,
          );

          await this.videoService.clearStreamingFiles(id);
          await this.videoService.uploadStreamingFiles(id, streamingOutDir);

          await this.pubSub.publish(
            `streamingGenerationProgress_${id}`,
            `Successfully uploaded streaming files for video ${id}`,
          );
        } catch (err) {
          await this.pubSub.publish(`streamingGenerationProgress_${id}`, err);
        } finally {
          fs.rmSync(streamingOutDir, { recursive: true });
        }
      })
      .catch((err) =>
        this.pubSub.publish(`streamingGenerationProgress_${id}`, err),
      );

    return true;
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin])
  @Mutation(() => VideoEntity)
  async createVideo() {
    return this.videoService.create({});
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

  @Subscription(() => String, {
    resolve: (value) => value,
  })
  streamingGenerationProgress(@Args('id', { type: () => Int }) id: number) {
    return this.pubSub.asyncIterator<string>(
      `streamingGenerationProgress_${id}`,
    );
  }

  @ResolveField(() => MediaEntity, { nullable: true })
  dashManifestMedia(
    @Parent() video: VideoEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return video.dashManifestMediaId
      ? loadersFactory
          .createOrGetLoader(MediaEntity, 'id')
          .load(video.dashManifestMediaId)
      : undefined;
  }

  @ResolveField(() => MediaEntity, { nullable: true })
  hlsManifestMedia(
    @Parent() video: VideoEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return video.hlsManifestMedia
      ? loadersFactory
          .createOrGetLoader(MediaEntity, 'id')
          .load(video.hlsManifestMediaId)
      : undefined;
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
