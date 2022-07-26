import { registerEnumType } from '@nestjs/graphql';

export enum AccessModeEnum {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

registerEnumType(AccessModeEnum, {
  name: 'AccessModeEnum',
});
