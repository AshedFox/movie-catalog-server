import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UpdateUserInput } from './dto/update-user.input';
import { UserModel } from './entities/user.model';
import { PaginatedUsers } from './dto/paginated-users.result';
import { GetUsersArgs } from './dto/get-users.args';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { CurrentUserDto } from './dto/current-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Resolver(UserModel)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserModel, { nullable: true })
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() currentUser: CurrentUserDto) {
    return this.userService.readOneById(currentUser.id);
  }

  @Query(() => PaginatedUsers)
  @UseGuards(JwtAuthGuard)
  getUsers(@Args() { take, skip }: GetUsersArgs) {
    return this.userService.findAll(take, skip);
  }

  @Query(() => UserModel, { nullable: true })
  @UseGuards(JwtAuthGuard)
  getUser(@Args('id', ParseUUIDPipe) id: string) {
    return this.userService.readOneById(id);
  }

  @Mutation(() => UserModel)
  @UseGuards(JwtAuthGuard)
  updateUser(
    @CurrentUser() currentUser: CurrentUserDto,
    @Args('input') updateUserInput: UpdateUserInput,
  ) {
    return this.userService.update(currentUser.id, updateUserInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  deleteMe(@CurrentUser() currentUser: CurrentUserDto) {
    return this.userService.delete(currentUser.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  deleteUser(@Args('id') id: string) {
    return this.userService.delete(id);
  }
}
