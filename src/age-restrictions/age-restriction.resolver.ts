import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AgeRestrictionService } from './age-restriction.service';
import { CreateAgeRestrictionInput } from './dto/create-age-restriction.input';
import { UpdateAgeRestrictionInput } from './dto/update-age-restriction.input';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '@utils/enums';
import { AgeRestrictionEntity } from './entities/age-restriction.entity';
import { GetAgeRestrictionsArgs } from './dto/get-age-restrictions.args';
import { PaginatedAgeRestrictions } from './dto/paginated-age-restrictions';

@Resolver(() => AgeRestrictionEntity)
export class AgeRestrictionResolver {
  constructor(private readonly ageRestrictionService: AgeRestrictionService) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => AgeRestrictionEntity)
  createAgeRestriction(
    @Args('input') createAgeRestrictionInput: CreateAgeRestrictionInput,
  ) {
    return this.ageRestrictionService.create(createAgeRestrictionInput);
  }

  @Query(() => PaginatedAgeRestrictions)
  getAgeRestrictions(
    @Args() { pagination, sort, filter }: GetAgeRestrictionsArgs,
  ) {
    return this.ageRestrictionService.readMany(pagination, sort, filter);
  }

  @Query(() => AgeRestrictionEntity)
  getAgeRestriction(@Args('id', { type: () => Int }) id: number) {
    return this.ageRestrictionService.readOne(id);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => AgeRestrictionEntity)
  updateAgeRestriction(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') updateAgeRestrictionInput: UpdateAgeRestrictionInput,
  ) {
    return this.ageRestrictionService.update(id, updateAgeRestrictionInput);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => Boolean)
  deleteAgeRestriction(@Args('id', { type: () => Int }) id: number) {
    return this.ageRestrictionService.delete(id);
  }
}
