import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { EmailConfirmationModel } from './entities/email-confirmation.model';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentUserDto } from '../user/dto/current-user.dto';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { ConfirmEmailInput } from './dto/confirm-email.input';
import { EmailService } from './email.service';

@Resolver(EmailConfirmationModel)
export class EmailResolver {
  constructor(private emailService: EmailService) {}

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
}
