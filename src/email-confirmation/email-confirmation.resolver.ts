import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentUserDto } from '../user/dto/current-user.dto';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { EmailConfirmationService } from './services/email-confirmation.service';

@Resolver()
export class EmailConfirmationResolver {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Boolean)
  sendConfirmation(@CurrentUser() currentUser: CurrentUserDto) {
    return this.emailConfirmationService.sendConfirmation(currentUser.id);
  }

  @Mutation(() => Boolean)
  confirmEmail(@Args('token') token: string) {
    return this.emailConfirmationService.confirmEmail(token);
  }
}
