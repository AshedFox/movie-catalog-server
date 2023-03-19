import { registerEnumType } from '@nestjs/graphql';

export enum VideoQualityEnum {
  QUALITY_240p = '240p',
  QUALITY_360p = '360p',
  QUALITY_720p = '720p',
  QUALITY_1080p = '1080p',
}

registerEnumType(VideoQualityEnum, {
  name: 'VideoQualityEnum',
});
