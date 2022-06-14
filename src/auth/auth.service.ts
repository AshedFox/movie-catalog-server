import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserModel } from '../user/entities/user.model';
import * as argon2 from 'argon2';
import { RegisterInput } from './dto/register.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateUser(username: string, password: string): Promise<UserModel> {
    const user = await this.userService.readOneByEmail(username);

    if (user && (await argon2.verify(user.password, password))) {
      user.password = '';
      return user;
    }
    return null;
  }

  async login(user: UserModel) {
    return {
      accessToken: this.jwtService.sign({
        email: user.email,
        sub: user.id,
      }),
    };
  }

  async register(registerInput: RegisterInput) {
    const user = await this.userService.create({
      ...registerInput,
      password: await argon2.hash(registerInput.password),
    });

    return {
      accessToken: this.jwtService.sign({
        email: user.email,
        sub: user.id,
      }),
    };
  }
}
