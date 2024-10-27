import { AudioProfileOptions, CodecName, VideoProfileOptions } from './types';
import { VideoProfileEnum, AudioProfileEnum, FormatEnum } from '@utils/enums';

export const VIDEO_PROFILES: Record<
  FormatEnum,
  Record<VideoProfileEnum, VideoProfileOptions>
> = {
  WEBM: {
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
      height: 1080,
      width: 1920,
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
  },
  MP4: {
    PROFILE_4k: {
      videoCodec: 'h265',
      bitRate: '7200k',
      height: 2160,
      width: 3840,
    },
    PROFILE_2k: {
      videoCodec: 'h265',
      bitRate: '4500k',
      height: 1440,
      width: 2560,
    },
    PROFILE_1080p: {
      videoCodec: 'h265',
      bitRate: '3060k',
      height: 1080,
      width: 1920,
    },
    PROFILE_720p: {
      videoCodec: 'h265',
      bitRate: '1930k',
      height: 720,
      width: 1280,
    },
    PROFILE_480p: {
      videoCodec: 'h265',
      bitRate: '600k',
      height: 480,
      width: 854,
    },
    PROFILE_360p: {
      videoCodec: 'h265',
      bitRate: '320k',
      height: 360,
      width: 640,
    },
    PROFILE_240p: undefined,
    PROFILE_144p: {
      videoCodec: 'h265',
      bitRate: '10k',
      height: 144,
      width: 256,
    },
  },
};

export const AUDIO_PROFILES: Record<
  FormatEnum,
  Record<AudioProfileEnum, AudioProfileOptions>
> = {
  WEBM: {
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
  },
  MP4: {
    PROFILE_4k: {
      audioFrequency: 48000,
      bitRate: '256k',
      audioCodec: 'aac',
      channels: 2,
    },
    PROFILE_2k: {
      audioFrequency: 48000,
      bitRate: '256k',
      audioCodec: 'aac',
      channels: 2,
    },
    PROFILE_1080p: {
      audioFrequency: 48000,
      bitRate: '256k',
      audioCodec: 'aac',
      channels: 2,
    },
    PROFILE_720p: {
      audioFrequency: 48000,
      bitRate: '192k',
      audioCodec: 'aac',
      channels: 2,
    },
    PROFILE_480p: {
      audioFrequency: 48000,
      bitRate: '192k',
      audioCodec: 'aac',
      channels: 2,
    },
    PROFILE_360p: {
      audioFrequency: 48000,
      bitRate: '128k',
      audioCodec: 'aac',
      channels: 2,
    },
    PROFILE_240p: {
      audioFrequency: 48000,
      bitRate: '128k',
      audioCodec: 'aac',
      channels: 2,
    },
    PROFILE_144p: {
      audioFrequency: 48000,
      bitRate: '96k',
      audioCodec: 'aac',
      channels: 2,
    },
  },
};

export const CODECS_LIBS: Record<CodecName, string> = {
  av1: 'libsvtav1',
  opus: 'libopus',
  aac: 'aac',
  h265: 'libx265',
  vp9: 'libvpx-vp9',
  h264: 'libx264',
};
