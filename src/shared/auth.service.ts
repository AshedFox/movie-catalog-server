import { Injectable } from '@nestjs/common';
import { LoginInput } from '../user/dto/login.input';
import { UserModel } from '../user/entities/user.model';
import { UserService } from '../user/user.service';
import { HttpQueryError } from 'apollo-server-core';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(loginInput: LoginInput): Promise<UserModel> {
    const user = this.userService.findOneByEmail(loginInput.email);

    if (!user) {
      throw new HttpQueryError(401, 'User not exists');
    }

    return user;
  }
}
