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
import { Inject, Logger, UseGuards } from '@nestjs/common';
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
import { MediaService } from '../media/media.service';
import { VideoVariantService } from '../video-variant/video-variant.service';
import path, { join } from 'path';
import * as fs from 'fs';
import { MediaTypeEnum } from '@utils/enums/media-type.enum';
import { MediaEntity } from '../media/entities/media.entity';
import { VideoAudioService } from '../video-audio/video-audio.service';
import { FfmpegService } from '../ffmpeg/ffmpeg.service';
import { GoogleCloudService } from '../cloud/google-cloud.service';
import { VideoAudioEntity } from '../video-audio/entities/video-audio.entity';

@Resolver(() => VideoEntity)
export class VideoResolver {
  constructor(
    private readonly videoService: VideoService,
    private readonly videoVariantService: VideoVariantService,
    private readonly videoAudioService: VideoAudioService,
    private readonly ffmpegService: FfmpegService,
    private readonly cloudService: GoogleCloudService,
    private readonly mediaService: MediaService,
    @Inject('PUB_SUB')
    private readonly pubSub: PubSub,
  ) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin])
  @Mutation(() => Boolean)
  async generateStreamingForVideo(@Args('id', { type: () => Int }) id: number) {
    const dashOutDir = join(process.cwd(), 'assets', `video_${id}`, 'dash');

    fs.mkdirSync(dashOutDir, { recursive: true });

    const videoVariantsPromise = this.videoVariantService.readMany(
      undefined,
      undefined,
      {
        videoId: {
          eq: id,
        },
      },
    );

    const audioVariantsPromise = this.videoAudioService.readMany(
      undefined,
      undefined,
      {
        videoId: {
          eq: id,
        },
      },
    );

    Promise.all([videoVariantsPromise, audioVariantsPromise])
      .then(async (data) => {
        let videoVariants = data[0];
        let audioVariants = data[1];
        const manifestPath = `${dashOutDir}//manifest.mpd`;

        if (audioVariants.length === 0 || videoVariants.length === 0) {
          await this.pubSub.publish(
            `videosGenerationProgress_${id}`,
            `Cannot generate streaming files for video ${id}, no audio or video variants.`,
          );
          Logger.error('no audio or video');
          return;
        }

        try {
          const videoMedia = await this.mediaService.readMany(
            undefined,
            undefined,
            {
              id: {
                in: videoVariants.map((value) => value.mediaId),
              },
            },
          );

          const audioMedia = await this.mediaService.readMany(
            undefined,
            undefined,
            {
              id: {
                in: audioVariants.map((value) => value.mediaId),
              },
            },
          );

          audioVariants = audioVariants.map((value) => {
            value.media = audioMedia.find(
              (media) => media.id === value.mediaId,
            );
            return value;
          });

          const videoPaths: Record<string, string[]> = {
            ENG: videoMedia.map((value) => value.url),
          };

          const audioPaths: Record<string, string[]> = {};

          audioVariants.forEach((value) => {
            if (!audioPaths[value.languageId]) {
              audioPaths[value.languageId] = [];
            }
            audioPaths[value.languageId].push(value.media.url);
          });

          await this.ffmpegService.makeDashManifest(
            videoPaths,
            audioPaths,
            manifestPath,
          );

          await this.pubSub.publish(
            `videosGenerationProgress_${id}`,
            `Successfully generated streaming files for video ${id}`,
          );
        } catch (err) {
          Logger.error(err);
          await this.pubSub.publish(
            `videosGenerationProgress_${id}`,
            `Failed to generate streaming files for video ${id}`,
          );
          return;
        }

        try {
          const dashFiles = fs.readdirSync(dashOutDir);

          for (const dashFile of dashFiles) {
            const uploadUrl = await this.cloudService.upload(
              join(dashOutDir, dashFile),
              `videos/video_${id}/dash/${dashFile}`,
            );

            if (dashFile === path.basename(manifestPath)) {
              const manifestMedia = await this.mediaService.create({
                type: MediaTypeEnum.RAW,
                url: uploadUrl,
              });

              await this.videoService.update(id, {
                manifestMediaId: manifestMedia.id,
              });
            }
          }

          await this.pubSub.publish(
            `videosGenerationProgress_${id}`,
            `Successfully uploaded streaming files for video ${id}`,
          );
        } catch (err) {
          Logger.error(err);
          await this.pubSub.publish(
            `videosGenerationProgress_${id}`,
            `Failed to upload streaming files for video ${id}}`,
          );
        }
      })
      .finally(() => fs.rmSync(dashOutDir, { recursive: true }));

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
  videosGenerationCompleted(@Args('id', { type: () => Int }) id: number) {
    return this.pubSub.asyncIterator<string>(`videosGenerationProgress_${id}`);
  }

  @ResolveField(() => [VideoVariantEntity])
  manifestMedia(
    @Parent() video: VideoEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(MediaEntity, 'id')
      .load(video.manifestMediaId);
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
