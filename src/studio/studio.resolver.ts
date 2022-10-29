import {
  Args,
  Context,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { StudioService } from './studio.service';
import { CreateStudioInput } from './dto/create-studio.input';
import { UpdateStudioInput } from './dto/update-studio.input';
import { StudioEntity } from './entities/studio.entity';
import { PaginatedStudios } from './dto/paginated-studios';
import { UseGuards } from '@nestjs/common';
import { GetStudiosArgs } from './dto/get-studios.args';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '../utils/enums/role.enum';
import { CountryEntity } from '../country/entities/country.entity';
import { IDataLoaders } from '../dataloader/idataloaders.interface';

@Resolver(StudioEntity)
export class StudioResolver {
  constructor(private readonly studioService: StudioService) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => StudioEntity)
  async createStudio(@Args('input') createStudioInput: CreateStudioInput) {
    return this.studioService.create(createStudioInput);
  }

  @Query(() => PaginatedStudios)
  getStudios(@Args() { pagination, sort, filter }: GetStudiosArgs) {
    return this.studioService.readMany(pagination, sort, filter);
  }

  @Query(() => StudioEntity, { nullable: true })
  getStudio(@Args('id', { type: () => Int }) id: number) {
    return this.studioService.readOne(id);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => StudioEntity)
  updateStudio(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') updateStudioInput: UpdateStudioInput,
  ) {
    return this.studioService.update(id, updateStudioInput);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => Boolean)
  deleteStudio(@Args('id', { type: () => Int }) id: number) {
    return this.studioService.delete(id);
  }

  @ResolveField(() => [CountryEntity])
  countries(
    @Parent() studio: StudioEntity,
    @Context('loaders') loaders: IDataLoaders,
  ) {
    return loaders.countriesByStudioLoader.load(studio.id);
  }
}
