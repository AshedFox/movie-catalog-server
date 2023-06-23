import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { PriceEntity } from '../../price/entities/price.entity';
import { PlanEntity } from '../../plan/entities/plan.entity';

@ObjectType('PlanPrice')
@Entity('plans_prices')
export class PlanPriceEntity {
  @Field(() => ID)
  @PrimaryColumn({ length: 255 })
  planId: string;

  @Field(() => PlanEntity)
  @ManyToOne(() => PlanEntity)
  plan: PlanEntity;

  @Field(() => ID)
  @PrimaryColumn({ length: 255 })
  priceId: string;

  @Field(() => PriceEntity)
  @ManyToOne(() => PriceEntity)
  price: PriceEntity;
}
