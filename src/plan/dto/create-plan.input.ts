import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PlanIntervalEnum } from '@utils/enums/plan-interval.enum';

@InputType()
class CreatePlanInput_Price {
  @Field()
  currencyId: string;

  @Field(() => Int)
  @Min(0)
  amount: number;

  @Field(() => PlanIntervalEnum)
  @IsEnum(PlanIntervalEnum)
  interval: PlanIntervalEnum;
}

@InputType()
export class CreatePlanInput {
  @Field()
  name: string;

  @Field(() => [CreatePlanInput_Price])
  @ValidateNested()
  @Type(() => CreatePlanInput_Price)
  prices: CreatePlanInput_Price[];
}
