import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserModel } from './entities/user.model';
import { PaginatedUsers } from './dto/paginated-users.result';
import { GetUsersArgs } from './dto/get-users.args';
import { ParseUUIDPipe } from '@nestjs/common';

@Resolver(UserModel)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  /*@Mutation()
  login(@Args('input') authInput: LoginInput) {
    if (this.userService.findOneByEmail(authInput.email)) {
    }
  }*/

  @Mutation(() => UserModel)
  createUser(@Args('input') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Query(() => PaginatedUsers)
  getUsers(@Args() { take, skip }: GetUsersArgs) {
    return this.userService.findAll(take, skip);
  }

  @Query(() => UserModel, { nullable: true })
  getUser(@Args('id', ParseUUIDPipe) id: string) {
    return this.userService.findOneById(id);
  }

  @Mutation(() => UserModel)
  updateUser(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('input') updateUserInput: UpdateUserInput,
  ) {
    return this.userService.update(id, updateUserInput);
  }

  @Mutation(() => Boolean)
  deleteUser(@Args('id', ParseUUIDPipe) id: string) {
    return this.userService.delete(id);
  }
}
