import { registerEnumType } from '@nestjs/graphql';

export enum MediaTypeEnum {
  VIDEO = 'video',
  IMAGE = 'image',
  SUBTITLES = 'subtitles',
}

registerEnumType(MediaTypeEnum, {
  name: 'MediaTypeEnum',
});
