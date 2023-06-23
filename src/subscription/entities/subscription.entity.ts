import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { PriceEntity } from '../../price/entities/price.entity';
import { SubscriptionStatusEnum } from '@utils/enums/subscription-status.enum';

@ObjectType('ServiceSubscription')
@Entity('subscriptions')
export class SubscriptionEntity {
  @Field(() => ID)
  @PrimaryColumn({ length: 255 })
  id: string;

  @Field()
  @Column()
  periodStart: Date;

  @Field()
  @Column()
  periodEnd: Date;

  @Field(() => SubscriptionStatusEnum)
  @Column({
    type: 'enum',
    enum: SubscriptionStatusEnum,
    enumName: 'subscription_status',
  })
  status: SubscriptionStatusEnum;

  @Field()
  @Column({ length: 255 })
  priceId: string;

  @Field(() => PriceEntity)
  @ManyToOne(() => PriceEntity)
  price: PriceEntity;

  @Field()
  @Column({ type: 'uuid' })
  userId: string;

  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity)
  user: UserEntity;
}
