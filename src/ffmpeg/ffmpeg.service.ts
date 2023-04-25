import { Injectable, Logger } from '@nestjs/common';
import { VideoProfileEnum } from '@utils/enums/video-profile.enum';
import Ffmpeg from 'fluent-ffmpeg';
import { AudioProfileEnum } from '@utils/enums/audio-profile.enum';

type VideoProfileOptions = {
  bitRate: string | number;
  videoCodec: 'av1' | 'vp9';
} & (
  | ({ aspect: string } & (
      | { height: number; width?: never }
      | { height?: never; width: number }
    ))
  | { aspect?: never; width: number; height: number }
);

type AudioProfileOptions = {
  audioFrequency: number;
  bitRate: string | number;
  audioCodec: 'opus' | 'vorbis';
  channels: number;
};

const videoProfiles: Record<VideoProfileEnum, VideoProfileOptions> = {
  PROFILE_4k: {
    videoCodec: 'av1',
    bitRate: '7200k',
    height: 2160,
    width: 3840,
  },
  PROFILE_2k: {
    videoCodec: 'av1',
    bitRate: '4500k',
    height: 1440,
    width: 2560,
  },
  PROFILE_1080p: {
    videoCodec: 'av1',
    bitRate: '3060k',
    height: 720,
    width: 1280,
  },
  PROFILE_720p: {
    videoCodec: 'av1',
    bitRate: '1930k',
    height: 720,
    width: 1280,
  },
  PROFILE_480p: {
    videoCodec: 'av1',
    bitRate: '600k',
    height: 480,
    width: 854,
  },
  PROFILE_360p: {
    videoCodec: 'av1',
    bitRate: '320k',
    height: 360,
    width: 640,
  },
  PROFILE_240p: undefined,
  PROFILE_144p: {
    videoCodec: 'av1',
    bitRate: '10k',
    height: 144,
    width: 256,
  },
};

const audioProfiles: Record<AudioProfileEnum, AudioProfileOptions> = {
  PROFILE_4k: {
    audioFrequency: 48000,
    bitRate: '256k',
    audioCodec: 'opus',
    channels: 2,
  },
  PROFILE_2k: {
    audioFrequency: 48000,
    bitRate: '256k',
    audioCodec: 'opus',
    channels: 2,
  },
  PROFILE_1080p: {
    audioFrequency: 48000,
    bitRate: '256k',
    audioCodec: 'opus',
    channels: 2,
  },
  PROFILE_720p: {
    audioFrequency: 48000,
    bitRate: '192k',
    audioCodec: 'opus',
    channels: 2,
  },
  PROFILE_480p: {
    audioFrequency: 48000,
    bitRate: '192k',
    audioCodec: 'opus',
    channels: 2,
  },
  PROFILE_360p: {
    audioFrequency: 48000,
    bitRate: '128k',
    audioCodec: 'opus',
    channels: 2,
  },
  PROFILE_240p: {
    audioFrequency: 48000,
    bitRate: '128k',
    audioCodec: 'opus',
    channels: 2,
  },
  PROFILE_144p: {
    audioFrequency: 48000,
    bitRate: '96k',
    audioCodec: 'opus',
    channels: 2,
  },
};

type CodecName = 'av1' | 'vp9' | 'opus' | 'vorbis';

const codecsLibs: Record<CodecName, string> = {
  av1: 'libsvtav1',
  opus: 'libopus',
  vorbis: 'libvorbis',
  vp9: 'libvpx-vp9',
};

@Injectable()
export class FfmpegService {
  makeDashManifest = (
    videoPaths: Record<string, string[]>,
    audioPaths: Record<string, string[]>,
    outputPath: string,
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

        command
          .outputOptions([...mapOpt, '-c copy'])
          .outputFormat('dash')
          .addOutputOption('-use_timeline 1')
          .addOutputOption('-use_template 1')
          .addOutputOption('-seg_duration 4')
          .addOutputOption(
            `-adaptation_sets`,
            adaptationSets
              .map((value, index) => {
                return `id=${index},streams=${value.join(',')}`;
              })
              .join(' '),
          )
          //.addOutputOption('-single_file 1')
          .addOutputOption('-dash_segment_type webm');

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
    return new Promise<void>((resolve, reject) => {
      try {
        const { audioCodec, audioFrequency, channels, bitRate } =
          audioProfiles[audioProfile];

        const command = Ffmpeg(inputPath);

        command
          .format('webm')
          .audioFrequency(audioFrequency)
          .audioBitrate(bitRate)
          .audioChannels(channels)
          .audioCodec(codecsLibs[audioCodec])
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

  /* Example of high-quality encoding ffmpeg -i "D:\Загрузки\pyrokinesis – молот ведьм (remastered).mp4" -y -an -filter:v scale=w=1280:h=720,fps=24 -c:v libsvtav1 -b:v 1930k -g 24 -preset 2 -crf 25 -pix_fmt yuv420p10le -threads:v 1 -svtav1-params tune=0:film-grain=8 D:\projects\movie-catalog\movie-catalog-server\assets\video_45\PROFILE_720p_video.webm */

  makeVideo = (
    inputPath: string,
    outputPath: string,
    profile: VideoProfileEnum,
    language?: string,
  ) => {
    return new Promise<void>((resolve, reject) => {
      try {
        const currentProfile = videoProfiles[profile];

        const { bitRate, videoCodec, width, height, aspect } = currentProfile;

        const command = Ffmpeg(inputPath);
        command.format('webm');

        if (width || height) {
          command.size(`${width ?? '?'}x${height ?? '?'}`);
        }

        command
          .videoCodec(codecsLibs[videoCodec])
          .videoBitrate(bitRate)
          .noAudio()
          .fpsOutput(30);

        aspect && command.setAspect(aspect);

        command.addOutputOptions(['-g 30', '-pix_fmt yuv420p10le']);

        if (videoCodec === 'av1') {
          command.addOutputOptions(['-preset 6', '-crf 32']);
          command.addOutputOption('-svtav1-params', 'tune=0:film-grain=8');
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
