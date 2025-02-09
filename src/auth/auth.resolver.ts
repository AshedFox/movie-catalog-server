import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { AuthResult } from './dto/auth.result';
import { SignUpInput } from './dto/sign-up.input';
import { LoginInput } from './dto/login.input';
import { GqlJwtAuthGuard } from './guards/gql-jwt-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResult)
  login(@Args('input') loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }

  @Mutation(() => AuthResult)
  signUp(@Args('input') signUpInput: SignUpInput) {
    return this.authService.signUp(signUpInput);
  }

  @Mutation(() => AuthResult)
  @UseGuards(GqlJwtAuthGuard)
  refresh(@CurrentUser() user: UserEntity) {
    return this.authService.makeAuthResult(user);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlJwtAuthGuard)
  logout() {
    return true;
  }
}
