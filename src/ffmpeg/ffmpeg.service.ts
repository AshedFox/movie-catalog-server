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
    format: FormatEnum,
    language?: string,
  ) => {
    return new Promise<void>((resolve, reject) => {
      try {
        const { audioCodec, audioFrequency, channels, bitRate } =
          AUDIO_PROFILES[format][audioProfile];

        const command = Ffmpeg(inputPath);

        command
          .format(format.toLowerCase())
          .audioFrequency(audioFrequency)
          .audioBitrate(bitRate)
          .audioChannels(channels)
          .audioCodec(CODECS_LIBS[audioCodec])
          .noVideo();

        language &&
          command.addOutputOption('-metadata:s:a:0', `language=${language}`);

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

  makeVideo = (
    inputPath: string,
    outputPath: string,
    profile: VideoProfileEnum,
    format: FormatEnum,
    language?: string,
  ) => {
    return new Promise<void>((resolve, reject) => {
      try {
        const currentProfile = VIDEO_PROFILES[format][profile];

        const { bitRate, videoCodec, width, height, aspect } = currentProfile;

        const command = Ffmpeg(inputPath);
        command.format(format.toLowerCase());

        if (width || height) {
          command.size(`${width ?? '?'}x${height ?? '?'}`);
        }

        command
          .videoCodec(CODECS_LIBS[videoCodec])
          .videoBitrate(bitRate)
          .noAudio()
          .fpsOutput(30);

        aspect && command.setAspect(aspect);

        command.addOutputOptions(['-g 30', '-pix_fmt yuv420p10le']);

        if (videoCodec === 'av1') {
          command.addOutputOptions(['-preset 6', '-crf 32']);
          command.addOutputOption('-svtav1-params', 'tune=0:film-grain=8');
        } else if (videoCodec === 'h265') {
          command.addOutputOptions([
            '-preset fast',
            '-crf 32',
            '-tune zerolatency',
            '-keyint_min 30',
          ]);
        }

        language &&
          command.addOutputOption('-metadata:s:v:0', `language=${language}`);

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
}
