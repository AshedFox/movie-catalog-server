import { registerEnumType } from '@nestjs/graphql';

export enum AudioProfileEnum {
  PROFILE_4k = 'PROFILE_4k',
  PROFILE_2k = 'PROFILE_2k',
  PROFILE_1080p = 'PROFILE_1080p',
  PROFILE_720p = 'PROFILE_720p',
  PROFILE_480p = 'PROFILE_480p',
  PROFILE_360p = 'PROFILE_360p',
  PROFILE_240p = 'PROFILE_240p',
  PROFILE_144p = 'PROFILE_144p',
}

registerEnumType(AudioProfileEnum, {
  name: 'AudioProfileEnum',
});
