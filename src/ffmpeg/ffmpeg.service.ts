import { Injectable, Logger } from '@nestjs/common';
import { VideoProfileEnum, AudioProfileEnum, FormatEnum } from '@utils/enums';
import Ffmpeg from 'fluent-ffmpeg';
import { AUDIO_PROFILES, CODECS_LIBS, VIDEO_PROFILES } from './constants';

@Injectable()
export class FfmpegService {
  makeDashManifest = (
    videoPaths: Record<string, string[]>,
    audioPaths: Record<string, string[]>,
    subtitlesPaths: Record<string, string>,
    outputPath: string,
    format?: FormatEnum,
  ) => {
    return new Promise<void>((resolve, reject) => {
      try {
        const command = Ffmpeg();

        const mapOpt: string[] = [];
        const adaptationSets: number[][] = [];

        for (const videoPathsKey in videoPaths) {
          adaptationSets.push([]);
          for (const videoPath of videoPaths[videoPathsKey]) {
            command.addInput(videoPath);
            adaptationSets[adaptationSets.length - 1].push(mapOpt.length);
            mapOpt.push(`-map ${mapOpt.length}:v:0`);
          }
        }

        for (const audioPathsKey in audioPaths) {
          adaptationSets.push([]);
          for (const audioPath of audioPaths[audioPathsKey]) {
            command.addInput(audioPath);
            adaptationSets[adaptationSets.length - 1].push(mapOpt.length);
            mapOpt.push(`-map ${mapOpt.length}:a:0`);
          }
        }

        for (const subtitlesPathsKey in subtitlesPaths) {
          adaptationSets.push([mapOpt.length]);
          command.addInput(subtitlesPaths[subtitlesPathsKey]);
          mapOpt.push(`-map ${mapOpt.length}:s:0`);
        }

        command
          .outputOptions([...mapOpt, '-c copy'])
          .outputFormat('dash')
          .addOutputOption('-use_timeline 1')
          .addOutputOption('-use_template 1')
          .addOutputOption('-seg_duration 4')
          .addOutputOption('-hls_playlist 1')
          .addOutputOption(
            `-adaptation_sets`,
            adaptationSets
              .map((value, index) => {
                return `id=${index},streams=${value.join(',')}`;
              })
              .join(' '),
          );

        format &&
          command.addOutputOption(`-dash_segment_type ${format.toLowerCase()}`);

        command
          .on('start', (commandLine) => {
            Logger.log('Spawned Ffmpeg with command: ' + commandLine);
          })
          .on('error', (err) => reject(err))
          .on('end', () => {
            resolve();
          })
          .saveToFile(outputPath);
      } catch (err) {
        Logger.log(err);
        reject(err);
      }
    });
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
        .fpsOutput(30)
        .addOutputOptions([
          `-g 120`,
          '-pix_fmt yuv420p',
          '-color_primaries bt709',
          '-color_trc bt709',
          '-colorspace bt709',
          `-keyint_min 120`,
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
