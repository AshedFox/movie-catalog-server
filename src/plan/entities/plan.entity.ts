import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryColumn, Relation } from 'typeorm';
import { PriceEntity } from '../../price/entities/price.entity';
import { PlanPriceEntity } from '../../plan-price/entities/plan-price.entity';

@ObjectType('Plan')
@Entity('plans')
export class PlanEntity {
  @Field(() => ID)
  @PrimaryColumn({ length: 255 })
  id: string;

  @Field()
  @Column({ length: 255 })
  name: string;

  @Field(() => [PriceEntity])
  prices: Relation<PriceEntity[]>;

  @HideField()
  @OneToMany(
    () => PlanPriceEntity,
    (subscriptionPrice) => subscriptionPrice.plan,
  )
  pricesConnection: Relation<PlanPriceEntity[]>;
}
