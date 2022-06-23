import { registerEnumType } from '@nestjs/graphql';

export enum RoleEnum {
  User = 'user',
  Moderator = 'moderator',
  Admin = 'admin',
}

registerEnumType(RoleEnum, {
  name: 'RoleEnum',
  description: 'User role in app',
});
