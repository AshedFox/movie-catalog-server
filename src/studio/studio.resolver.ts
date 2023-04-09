import {
  Args,
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
import { RoleEnum } from '@utils/enums';
import { CountryEntity } from '../country/entities/country.entity';
import { LoadersFactory } from '../dataloader/decorators/loaders-factory.decorator';
import { DataLoaderFactory } from '../dataloader/data-loader.factory';
import { StudioCountryEntity } from '../studio-country/entities/studio-country.entity';

@Resolver(StudioEntity)
export class StudioResolver {
  constructor(private readonly studioService: StudioService) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => StudioEntity)
  createStudio(@Args('input') createStudioInput: CreateStudioInput) {
    return this.studioService.create(createStudioInput);
  }

  @Query(() => PaginatedStudios)
  async getStudios(@Args() { sort, filter, ...pagination }: GetStudiosArgs) {
    const [data, count] = await Promise.all([
      this.studioService.readMany(pagination, sort, filter),
      this.studioService.count(filter),
    ]);

    const { limit, offset } = pagination;

    return {
      nodes: data,
      pageInfo: {
        totalCount: count,
        hasNextPage: count > limit + offset,
        hasPreviousPage: offset > 0,
      },
    };
  }

  @Query(() => StudioEntity)
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
  @Mutation(() => StudioEntity)
  deleteStudio(@Args('id', { type: () => Int }) id: number) {
    return this.studioService.delete(id);
  }

  @ResolveField(() => [CountryEntity])
  countries(
    @Parent() studio: StudioEntity,
    @LoadersFactory() loadersFactory: DataLoaderFactory,
  ) {
    return loadersFactory
      .createOrGetLoader(
        StudioCountryEntity,
        'studioId',
        StudioEntity,
        'id',
        'country',
        CountryEntity,
      )
      .load({ id: studio.id });
  }
}
