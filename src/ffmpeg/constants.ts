import { AudioProfileOptions, CodecName, VideoProfileOptions } from './types';
import { VideoProfileEnum, AudioProfileEnum } from '@utils/enums';

export const VIDEO_PROFILES: Record<VideoProfileEnum, VideoProfileOptions> = {
  PROFILE_4k: {
    videoCodec: 'av1',
    maxBitRate: '28m',
    crf: 18,
    height: 2160,
    width: 3840,
  },
  PROFILE_2k: {
    videoCodec: 'av1',
    maxBitRate: '16m',
    crf: 20,
    height: 1440,
    width: 2560,
  },
  PROFILE_1080p: {
    videoCodec: 'av1',
    maxBitRate: '8m',
    crf: 23,
    height: 1080,
    width: 1920,
  },
  PROFILE_720p: {
    videoCodec: 'av1',
    maxBitRate: '5m',
    crf: 26,
    height: 720,
    width: 1280,
  },
  PROFILE_480p: {
    videoCodec: 'av1',
    maxBitRate: '2500k',
    crf: 28,
    height: 480,
    width: 854,
  },
  PROFILE_360p: {
    videoCodec: 'av1',
    maxBitRate: '1m',
    crf: 32,
    height: 360,
    width: 640,
  },
  PROFILE_240p: {
    videoCodec: 'av1',
    maxBitRate: '300k',
    crf: 36,
    height: 240,
    width: 426,
  },
  PROFILE_144p: {
    videoCodec: 'av1',
    maxBitRate: '150k',
    crf: 38,
    height: 144,
    width: 256,
  },
};

export const AUDIO_PROFILES: Record<AudioProfileEnum, AudioProfileOptions> = {
  ULTRA: {
    audioFrequency: 48000,
    bitRate: '320k',
    audioCodec: 'aac',
    channels: 2,
  },
  HIGH: {
    audioFrequency: 48000,
    bitRate: '256k',
    audioCodec: 'aac',
    channels: 2,
  },
  MEDIUM: {
    audioFrequency: 48000,
    bitRate: '128k',
    audioCodec: 'aac',
    channels: 2,
  },
  LOW: {
    audioFrequency: 48000,
    bitRate: '64k',
    audioCodec: 'aac',
    channels: 2,
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
