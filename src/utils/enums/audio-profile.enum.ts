import { registerEnumType } from '@nestjs/graphql';

export enum AudioProfileEnum {
  ULTRA = 'ULTRA',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

registerEnumType(AudioProfileEnum, {
  name: 'AudioProfileEnum',
});
