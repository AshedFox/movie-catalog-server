import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StudioService } from './studio.service';
import { CreateStudioInput } from './dto/create-studio.input';
import { UpdateStudioInput } from './dto/update-studio.input';
import { StudioModel } from './entities/studio.model';
import { PaginatedStudios } from './dto/paginated-studios.result';
import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { GetStudiosArgs } from './dto/get-studios.args';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '../shared/role.enum';

@Resolver(StudioModel)
export class StudioResolver {
  constructor(private readonly studioService: StudioService) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => StudioModel)
  createStudio(@Args('input') createStudioInput: CreateStudioInput) {
    return this.studioService.create(createStudioInput);
  }

  @Query(() => PaginatedStudios)
  getStudios(@Args() { searchName, take, skip }: GetStudiosArgs) {
    return this.studioService.readAll(searchName, take, skip);
  }

  @Query(() => StudioModel, { nullable: true })
  getStudio(@Args('id', ParseIntPipe) id: number) {
    return this.studioService.readOne(id);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => StudioModel)
  updateStudio(
    @Args('id', ParseIntPipe) id: number,
    @Args('input') updateStudioInput: UpdateStudioInput,
  ) {
    return this.studioService.update(id, updateStudioInput);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => Boolean)
  deleteStudio(@Args('id', ParseIntPipe) id: number) {
    return this.studioService.delete(id);
  }
}
