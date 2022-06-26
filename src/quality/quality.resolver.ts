import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { QualityService } from './quality.service';
import { CreateQualityInput } from './dto/create-quality.input';
import { UpdateQualityInput } from './dto/update-quality.input';
import { QualityModel } from './entities/quality.model';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '../user/entities/role.enum';

@Resolver(() => QualityModel)
export class QualityResolver {
  constructor(private readonly qualityService: QualityService) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin])
  @Mutation(() => QualityModel)
  createQuality(@Args('input') input: CreateQualityInput) {
    return this.qualityService.create(input);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Query(() => [QualityModel])
  getQualities() {
    return this.qualityService.readAll();
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Query(() => QualityModel)
  getQuality(@Args('id', { type: () => Int }) id: number) {
    return this.qualityService.readOne(id);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin])
  @Mutation(() => QualityModel)
  updateQuality(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateQualityInput,
  ) {
    return this.qualityService.update(id, input);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin])
  @Mutation(() => Boolean)
  deleteQuality(@Args('id', { type: () => Int }) id: number) {
    return this.qualityService.delete(id);
  }
}
