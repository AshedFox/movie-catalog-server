import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, PrimaryColumn, Relation } from 'typeorm';
import { PriceEntity } from '../../price/entities/price.entity';
import { ProductEntity } from '../../product/entities/product.entity';

@ObjectType('ProductPrice')
@Entity('products_prices')
export class ProductPriceEntity {
  @Field(() => ID)
  @PrimaryColumn({ length: 255 })
  productId: string;

  @Field(() => ProductEntity)
  @ManyToOne(() => ProductEntity)
  product: Relation<ProductEntity>;

  @Field(() => ID)
  @PrimaryColumn({ length: 255 })
  priceId: string;

  @Field(() => PriceEntity)
  @ManyToOne(() => PriceEntity)
  price: Relation<PriceEntity>;
}
