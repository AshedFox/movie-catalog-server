import { Mutation, Resolver } from '@nestjs/graphql';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { RefreshTokenService } from './refresh-token.service';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '../utils/enums/role.enum';
import { Cron, CronExpression } from '@nestjs/schedule';

@Resolver(RefreshTokenEntity)
export class RefreshTokenResolver {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  @Mutation(() => Boolean)
  deleteExpiredRefreshTokens() {
    return this.refreshTokenService.deleteExpired();
  }
}
