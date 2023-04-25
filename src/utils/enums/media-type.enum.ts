import { registerEnumType } from '@nestjs/graphql';

export enum MediaTypeEnum {
  VIDEO = 'VIDEO',
  IMAGE = 'IMAGE',
  RAW = 'RAW',
}

registerEnumType(MediaTypeEnum, {
  name: 'MediaTypeEnum',
});
