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
import { UserEntity } from './entities/user.entity';
import { PaginatedUsers } from './dto/paginated-users';
import { GetUsersArgs } from './dto/get-users.args';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentUserDto } from './dto/current-user.dto';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '@utils/enums';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CountryEntity } from '../country/entities/country.entity';
import { IDataLoaders } from '../dataloader/idataloaders.interface';
import { MediaEntity } from '../media/entities/media.entity';

@Resolver(UserEntity)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserEntity, { nullable: true })
  @UseGuards(GqlJwtAuthGuard)
  getMe(@CurrentUser() currentUser: CurrentUserDto) {
    return this.userService.readOneById(currentUser.id);
  }

  @Query(() => PaginatedUsers)
  getUsers(@Args() { pagination, sort, filter }: GetUsersArgs) {
    return this.userService.readMany(pagination, sort, filter);
  }

  @Query(() => UserEntity)
  getUser(@Args('id', ParseUUIDPipe) id: string) {
    return this.userService.readOneById(id);
  }

  @Mutation(() => UserEntity)
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

  @ResolveField(() => CountryEntity)
  country(
    @Parent() parent: UserEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return parent.countryId
      ? loaders.countryLoader.load(parent.countryId)
      : undefined;
  }

  @ResolveField(() => MediaEntity)
  avatar(
    @Parent() parent: UserEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return parent.avatarId
      ? loaders.mediaLoader.load(parent.avatarId)
      : undefined;
  }
}
