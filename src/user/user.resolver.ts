import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { UpdateUserInput } from './dto/update-user.input';
import { UserModel } from './entities/user.model';
import { PaginatedUsers } from './dto/paginated-users.result';
import { GetUsersArgs } from './dto/get-users.args';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentUserDto } from './dto/current-user.dto';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from './entities/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CountryModel } from '../country/entities/country.model';
import { IDataLoaders } from '../dataloader/idataloaders.interface';

@Resolver(UserModel)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserModel, { nullable: true })
  @UseGuards(GqlJwtAuthGuard)
  getMe(@CurrentUser() currentUser: CurrentUserDto) {
    return this.userService.readOneById(currentUser.id);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Query(() => PaginatedUsers)
  getUsers(@Args() { take, skip }: GetUsersArgs) {
    return this.userService.readAll(take, skip);
  }

  @Query(() => UserModel, { nullable: true })
  @UseGuards(GqlJwtAuthGuard)
  getUser(@Args('id', ParseUUIDPipe) id: string) {
    return this.userService.readOneById(id);
  }

  @Mutation(() => UserModel)
  @UseGuards(GqlJwtAuthGuard)
  updateMe(
    @CurrentUser() currentUser: CurrentUserDto,
    @Args('input') updateUserInput: UpdateUserInput,
  ) {
    return this.userService.update(currentUser.id, updateUserInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlJwtAuthGuard)
  deleteMe(@CurrentUser() currentUser: CurrentUserDto) {
    return this.userService.delete(currentUser.id);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => Boolean)
  deleteUser(@Args('id') id: string) {
    return this.userService.delete(id);
  }

  @ResolveField(() => CountryModel)
  country(
    @Parent() parent: UserModel,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return parent.countryId
      ? loaders.countryLoader.load(parent.countryId)
      : undefined;
  }
}
