import { registerEnumType } from '@nestjs/graphql';

export enum FormatEnum {
  MP4 = 'MP4',
  WEBM = 'WEBM',
}

registerEnumType(FormatEnum, {
  name: 'FormatEnum',
});
