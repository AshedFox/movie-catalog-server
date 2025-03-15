export type VideoCodecType = 'av1' | 'vp9' | 'h265' | 'h264';
export type AudioCodecType = 'opus' | 'aac';

export type VideoProfileOptions = {
  maxBitRate: string | number;
  crf: number;
  videoCodec: VideoCodecType;
  height: number;
  width: number;
};

export type AudioProfileOptions = {
  audioFrequency: number;
  bitRate: string | number;
  audioCodec: AudioCodecType;
  channels: number;
};

export type CodecName = VideoCodecType | AudioCodecType;
