import {
  Args,
  Mutation,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { VideoAudioService } from './video-audio.service';
import { Inject, Logger, UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '@utils/enums';
import { join } from 'path';
import fs from 'fs';
import { AudioProfileEnum } from '@utils/enums/audio-profile.enum';
import { GenerateVideoAudiosInput } from './dto/generate-video-audios.input';
import { PubSub } from 'graphql-subscriptions';
import { VideoEntity } from '../video/entities/video.entity';
import { LoadersFactory } from '../dataloader/decorators/loaders-factory.decorator';
import { DataLoaderFactory } from '../dataloader/data-loader.factory';
import { MediaEntity } from '../media/entities/media.entity';
import { LanguageEntity } from '../language/entities/language.entity';

@Resolver()
export class VideoAudioResolver {
  constructor(
    private readonly videoAudioService: VideoAudioService,
    @Inject('PUB_SUB')
    private readonly pubSub: PubSub,
  ) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => Boolean)
  generateVideoAudios(
    @Args('input')
    {
      videoId,
      profiles,
      originalMediaUrl,
      languageId,
      format,
    }: GenerateVideoAudiosInput,
  ) {
    const outDir = join(process.cwd(), 'assets', `video_${videoId}`);

    fs.mkdirSync(outDir, { recursive: true });

    new Promise<{
      successful: AudioProfileEnum[];
      failed: AudioProfileEnum[];
    }>(async (resolve) => {
      const successful: AudioProfileEnum[] = [];
      const failed: AudioProfileEnum[] = [];

      for (const audioProfile of profiles) {
        try {
          await this.videoAudioService.makeForProfile(
            videoId,
            audioProfile,
            languageId,
            originalMediaUrl,
            outDir,
            `${audioProfile}_audio_${languageId}`,
            format,
          );

          successful.push(audioProfile);

          await this.pubSub.publish(
            `videosGenerationProgress_${videoId}`,
            `Successfully generated audio file for audio ${videoId} and profile ${audioProfile}`,
          );
        } catch (err) {
          failed.push(audioProfile);

          Logger.error(err);

          await this.pubSub.publish(
            `videosGenerationProgress_${videoId}`,
            `Failed to generate audio file for audio ${videoId} and profile ${audioProfile}`,
          );
        }
      }

      resolve({ successful, failed });
    }).then(async (result) => {
      const { successful, failed } = result;

      await this.pubSub.publish(
        `videosGenerationProgress_${videoId}`,
        `Audio files generation completed for video ${videoId}. Failed to generate audio files for profiles [${failed.join(
          ', ',
        )}]. Successfully generated audio files for profiles [${successful.join(
          ', ',
        )}].`,
      );
    });

    return true;
  }

  @ResolveField(() => VideoEntity)
  video(
    @Root() videoAudio: VideoAudioEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(VideoEntity, 'id')
      .load(videoAudio.videoId);
  }

  @ResolveField(() => MediaEntity)
  media(
    @Root() videoAudio: VideoAudioEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(MediaEntity, 'id')
      .load(videoAudio.mediaId);
  }

  @ResolveField(() => LanguageEntity)
  language(
    @Root() videoAudio: VideoAudioEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(LanguageEntity, 'id')
      .load(videoAudio.languageId);
  }
}
