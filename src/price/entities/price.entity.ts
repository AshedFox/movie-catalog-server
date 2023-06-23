import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { CurrencyEntity } from '../../currency/entities/currency.entity';
import { PlanIntervalEnum } from '@utils/enums/plan-interval.enum';

@ObjectType('Price')
@Entity('prices')
export class PriceEntity {
  @Field(() => ID)
  @PrimaryColumn({ length: 255 })
  id: string;

  @Field()
  @Column({ type: 'char', length: 3 })
  currencyId: string;

  @Field(() => CurrencyEntity)
  @ManyToOne(() => CurrencyEntity, {
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  currency: CurrencyEntity;

  @Field(() => Int)
  @Column({ type: 'int4' })
  amount: number;

  @Field(() => PlanIntervalEnum, { nullable: true })
  @Column({
    type: 'enum',
    enum: PlanIntervalEnum,
    enumName: 'plan_interval_enum',
    nullable: true,
  })
  interval?: PlanIntervalEnum;
}
