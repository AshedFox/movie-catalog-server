import { UserEntity } from '../entities/user.entity';
import { RoleEnum } from '../../utils/enums/role.enum';

export class CurrentUserDto implements Partial<UserEntity> {
  id: string;
  email: string;
  role: RoleEnum;
}
