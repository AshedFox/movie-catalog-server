import { Injectable, Logger } from '@nestjs/common';
import { VideoProfileEnum, AudioProfileEnum } from '@utils/enums';
import Ffmpeg from 'fluent-ffmpeg';
import {
  AUDIO_PROFILES,
  CODECS_LIBS,
  KEYFRAME_STEP,
  SEGMENT_DURATION,
  TARGET_FRAMES,
  VIDEO_PROFILES,
} from './constants';
import { join } from 'path';
import { mkdir } from 'fs/promises';

@Injectable()
export class FfmpegService {
  makeMPEGDash = async (
    videoPaths: Record<string, string[]>,
    audioPaths: Record<string, string[]>,
    outputPath: string,
  ) => {
    try {
      const command = Ffmpeg({ cwd: outputPath });

      const mapOpt: string[] = [];
      let streamIndex = 0;

      for (const languageKey in videoPaths) {
        for (const videoPath of videoPaths[languageKey]) {
          command.addInput(videoPath);
          mapOpt.push(`-map ${streamIndex}:v:0`);
          streamIndex++;
        }
      }

      for (const languageKey in audioPaths) {
        for (const audioPath of audioPaths[languageKey]) {
          command.addInput(audioPath);
          mapOpt.push(`-map ${streamIndex}:a:0`);
          streamIndex++;
        }
      }

      command
        .outputOptions([...mapOpt, '-c copy'])
        .outputFormat('dash')
        .addOutputOption('-use_timeline 0')
        .addOutputOption(`-seg_duration ${SEGMENT_DURATION}`)
        .addOutputOption(`-frag_duration ${SEGMENT_DURATION}`)
        .addOutputOption('-adaptation_sets "id=0,streams=v id=1,streams=a"')
        .addOutputOption('-init_seg_name', '$RepresentationID$/init.$ext$')
        .addOutputOption(
          '-media_seg_name',
          '$RepresentationID$/seg-$Number$.$ext$',
        );

      for (let i = 0; i < streamIndex; i++) {
        await mkdir(join(outputPath, String(i)), { recursive: true });
      }

      return new Promise<void>((resolve, reject) => {
        command
          .on('start', (commandLine) => {
            Logger.log('Spawned Ffmpeg with command: ' + commandLine);
          })
          .on('error', (err, stdout, stderr) => {
            Logger.error(`FFmpeg error: ${err.message}\n${stdout}\n${stderr}`);
            reject(err);
          })
          .on('end', () => {
            Logger.log(`DASH manifest created at ${outputPath}`);
            resolve();
          })
          .saveToFile('master.mpd');
      });
    } catch (err) {
      Logger.error(`Error in makeDashManifest: ${err.message}`);
      throw err;
    }
  };

  makeAudio = (
    inputPath: string,
    outputPath: string,
    audioProfile: AudioProfileEnum,
    language?: string,
  ) => {
    try {
      const { audioCodec, audioFrequency, channels, bitRate } =
        AUDIO_PROFILES[audioProfile];

      const command = Ffmpeg(inputPath);

      command
        .format('mp4')
        .audioFrequency(audioFrequency)
        .audioBitrate(bitRate)
        .addOption(`-bufsize ${bitRate}`)
        .audioChannels(channels)
        .audioCodec(CODECS_LIBS[audioCodec])
        .noVideo();

      language &&
        command.addOutputOption('-metadata:s:a:0', `language=${language}`);

      return new Promise<void>((resolve, reject) => {
        command
          .on('start', (commandLine) => {
            Logger.log('Spawned FFmpeg with command: ' + commandLine);
          })
          .on('error', (err) => {
            Logger.error(`FFmpeg error: ${err.message}`);
            reject(err);
          })
          .on('end', () => {
            Logger.log(`Audio created at ${outputPath}`);
            resolve();
          })
          .saveToFile(outputPath);
      });
    } catch (err) {
      Logger.error(`Error in makeAudio: ${err.message}`);
      throw err;
    }
  };

  makeVideo = (
    inputPath: string,
    outputPath: string,
    profile: VideoProfileEnum,
    language?: string,
  ) => {
    try {
      const currentProfile = VIDEO_PROFILES[profile];

      const { maxBitRate, crf, videoCodec, width, height } = currentProfile;

      const command = Ffmpeg(inputPath);
      command
        .format('mp4')
        .videoCodec(CODECS_LIBS[videoCodec])
        .size(`${width}x${height}`)
        .noAudio()
        .fpsOutput(TARGET_FRAMES)
        .addOutputOptions([
          `-g ${KEYFRAME_STEP}`,
          '-pix_fmt yuv420p',
          '-color_primaries bt709',
          '-color_trc bt709',
          '-colorspace bt709',
          `-keyint_min ${KEYFRAME_STEP}`,
          `-maxrate ${maxBitRate}`,
          `-crf ${crf}`,
        ]);

      if (videoCodec === 'av1') {
        command.addOutputOption(
          '-svtav1-params',
          'tune=0:film-grain=10:preset=4:lp=0',
        );
      } else if (videoCodec === 'h265' || videoCodec === 'h264') {
        command.addOutputOptions([
          `-preset high`,
          `-tune zerolatency`,
          `-profile high`,
          `-level 4.0`,
          `-movflags +faststart`,
        ]);
      }

      language &&
        command.addOutputOption('-metadata:s:v:0', `language=${language}`);

      return new Promise<void>((resolve, reject) => {
        command
          .on('start', (commandLine) => {
            Logger.log('Spawned FFmpeg with command: ' + commandLine);
          })
          .on('error', (err, _, stderr) => {
            Logger.error(`FFmpeg error: ${err.message}; ${stderr}`);
            reject(err);
          })
          .on('end', () => {
            Logger.log(`Video created at ${outputPath}`);
            resolve();
          })
          .saveToFile(outputPath);
      });
    } catch (err) {
      Logger.error(`Error in makeVideo: ${err.message}`);
      throw err;
    }
  };
}
