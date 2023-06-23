import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsOptional, Min } from 'class-validator';
import { PlanIntervalEnum } from '@utils/enums/plan-interval.enum';

@InputType()
export class CreatePriceInput {
  @Field()
  productId: string;

  @Field()
  currencyId: string;

  @Field(() => Int)
  @Min(0)
  amount: number;

  @Field(() => PlanIntervalEnum, { nullable: true })
  @IsEnum(PlanIntervalEnum)
  @IsOptional()
  interval?: PlanIntervalEnum;
}
