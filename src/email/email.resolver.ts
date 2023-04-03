import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentUserDto } from '../user/dto/current-user.dto';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { EmailService } from './services/email.service';

@Resolver()
export class EmailResolver {
  constructor(private readonly emailService: EmailService) {}

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Boolean)
  sendConfirmation(@CurrentUser() currentUser: CurrentUserDto) {
    return this.emailService.sendConfirmation(currentUser.id);
  }

  @Mutation(() => Boolean)
  confirmEmail(@Args('token') token: string) {
    return this.emailService.confirmEmail(token);
  }
}
