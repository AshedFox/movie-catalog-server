import { UserModel } from '../entities/user.model';

export class CurrentUserDto implements Partial<UserModel> {
  id: string;
  email: string;
}
