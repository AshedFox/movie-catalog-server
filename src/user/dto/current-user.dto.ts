import { UserModel } from '../entities/user.model';
import { RoleEnum } from '../../shared/role.enum';

export class CurrentUserDto implements Partial<UserModel> {
  id: string;
  email: string;
  role: RoleEnum;
}
