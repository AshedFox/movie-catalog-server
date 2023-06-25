import { registerEnumType } from '@nestjs/graphql';

export enum PlanIntervalEnum {
  MONTH = 'month',
  YEAR = 'year',
}

registerEnumType(PlanIntervalEnum, {
  name: 'PlanIntervalEnum',
});
