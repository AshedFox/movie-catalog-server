import { UserEntity } from '../entities/user.entity';
import { RoleEnum } from '@utils/enums';

export class CurrentUserDto implements Partial<UserEntity> {
  id: string;
  email: string;
  role: RoleEnum;
}
