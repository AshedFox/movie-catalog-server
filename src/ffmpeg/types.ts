export type VideoCodecType = 'av1' | 'vp9' | 'h265' | 'h264';
export type AudioCodecType = 'opus' | 'aac';

export type VideoProfileOptions = {
  bitRate: string | number;
  videoCodec: VideoCodecType;
} & (
  | ({ aspect: string } & (
      | { height: number; width?: never }
      | { height?: never; width: number }
    ))
  | { aspect?: never; width: number; height: number }
);

export type AudioProfileOptions = {
  audioFrequency: number;
  bitRate: string | number;
  audioCodec: AudioCodecType;
  channels: number;
};

export type CodecName = VideoCodecType | AudioCodecType;
