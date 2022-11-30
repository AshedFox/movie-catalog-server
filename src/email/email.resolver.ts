import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { EmailConfirmationEntity } from './entities/email-confirmation.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentUserDto } from '../user/dto/current-user.dto';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { ConfirmEmailInput } from './dto/confirm-email.input';
import { EmailService } from './services/email.service';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '@utils/enums';
import { RolesGuard } from '../auth/guards/roles.guard';
import { EmailConfirmationService } from './services/email-confirmation.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Resolver(EmailConfirmationEntity)
export class EmailResolver {
  constructor(
    private readonly emailService: EmailService,
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Boolean)
  sendConfirmation(@CurrentUser() currentUser: CurrentUserDto) {
    return this.emailService.sendConfirmation(
      currentUser.id,
      currentUser.email,
    );
  }

  @Mutation(() => Boolean)
  confirmEmail(
    @CurrentUser() currentUser: CurrentUserDto,
    @Args('input') { email, token }: ConfirmEmailInput,
  ) {
    return this.emailService.confirmEmail(token, email);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Cron(CronExpression.EVERY_WEEK)
  @Mutation(() => Boolean)
  deleteExpiredConfirmations() {
    return this.emailConfirmationService.deleteExpired();
  }
}
