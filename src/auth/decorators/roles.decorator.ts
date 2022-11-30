import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '@utils/enums';

export const ROLES_KEY = 'roles';
export const Role = (roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles);
