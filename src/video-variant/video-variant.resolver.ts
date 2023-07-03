import {
  Args,
  Int,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { VideoVariantEntity } from './entities/video-variant.entity';
import { VideoVariantService } from './video-variant.service';
import { CreateVideoVariantInput } from './dto/create-video-variant.input';
import { Inject, UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '@utils/enums';
import { VideoEntity } from '../video/entities/video.entity';
import { MediaEntity } from '../media/entities/media.entity';
import { UpdateVideoVariantInput } from './dto/update-video-variant.input';
import { LoadersFactory } from '../dataloader/decorators/loaders-factory.decorator';
import { DataLoaderFactory } from '../dataloader/data-loader.factory';
import { PubSub } from 'graphql-subscriptions';
import { GenerateVideoVariantsInput } from './dto/generate-video-variants.input';
import { VideoProfileEnum } from '@utils/enums/video-profile.enum';
import { join } from 'path';
import fs from 'fs';

@Resolver(() => VideoVariantEntity)
export class VideoVariantResolver {
  constructor(
    private readonly videoVariantService: VideoVariantService,
    @Inject('PUB_SUB')
    private readonly pubSub: PubSub,
  ) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => VideoVariantEntity)
  createVideoVariant(@Args('input') input: CreateVideoVariantInput) {
    return this.videoVariantService.create(input);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => Boolean)
  generateVideoVariants(
    @Args('input')
    { videoId, profiles, originalMediaUrl, format }: GenerateVideoVariantsInput,
  ) {
    const outDir = join(process.cwd(), 'assets', `video_${videoId}`);

    fs.mkdirSync(outDir, { recursive: true });

    new Promise<{
      successful: VideoProfileEnum[];
      failed: VideoProfileEnum[];
    }>(async (resolve) => {
      const successful: VideoProfileEnum[] = [];
      const failed: VideoProfileEnum[] = [];

      for (const videoProfile of profiles) {
        try {
          await this.videoVariantService.makeForProfile(
            videoId,
            videoProfile,
            originalMediaUrl,
            outDir,
            `${videoProfile}_video`,
            format,
          );
          successful.push(videoProfile);

          await this.pubSub.publish(
            `videosGenerationProgress_${videoId}`,
            `Successfully generated video file for video ${videoId} and profile ${videoProfile}`,
          );
        } catch (err) {
          failed.push(videoProfile);

          Logger.error(err);
          await this.pubSub.publish(
            `videosGenerationProgress_${videoId}`,
            `Failed to generate video file for video ${videoId} and profile ${videoProfile}`,
          );
        }
      }

      resolve({ successful, failed });
    }).then(async (result) => {
      const { successful, failed } = result;

      await this.pubSub.publish(
        `videosGenerationProgress_${videoId}`,
        `Video files generation completed for video ${videoId}. Failed to generate video files for profiles [${failed.join(
          ', ',
        )}]. Successfully generated video files for profiles [${successful.join(
          ', ',
        )}].`,
      );
    });

    return true;
  }

  @Query(() => [VideoVariantEntity])
  getVideosVariants() {
    return this.videoVariantService.readMany();
  }

  @Query(() => VideoVariantEntity)
  getVideoVariant(@Args('id', { type: () => Int }) id: number) {
    return this.videoVariantService.readOne(id);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => VideoVariantEntity)
  updateVideoVariant(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateVideoVariantInput,
  ) {
    return this.videoVariantService.update(id, input);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => VideoVariantEntity)
  deleteVideoVariant(@Args('id') id: number) {
    return this.videoVariantService.delete(id);
  }

  @ResolveField(() => VideoEntity)
  video(
    @Root() videoVariant: VideoVariantEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(VideoEntity, 'id')
      .load(videoVariant.videoId);
  }

  @ResolveField(() => MediaEntity)
  media(
    @Root() videoVariant: VideoVariantEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(MediaEntity, 'id')
      .load(videoVariant.mediaId);
  }
}
