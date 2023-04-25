import { Args, Mutation, Resolver } from '@nestjs/graphql';
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
  async generateVideoAudios(
    @Args('input')
    {
      videoId,
      profiles,
      originalMediaUrl,
      languageId,
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
            'webm',
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
}
