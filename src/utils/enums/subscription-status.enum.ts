import { registerEnumType } from '@nestjs/graphql';

export enum SubscriptionStatusEnum {
  IN_PROCESS = 'in_process',
  ACTIVE = 'active',
  CANCELED = 'canceled',
  PAST_DUE = 'past_due',
}

registerEnumType(SubscriptionStatusEnum, {
  name: 'SubscriptionStatusEnum',
});
