import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { PriceEntity } from '../../price/entities/price.entity';
import { MovieEntity } from '../../movie/entities/movie.entity';
import { ProductPriceEntity } from '../../product-price/entities/product-price.entity';

@ObjectType('Product')
@Entity('products')
export class ProductEntity {
  @Field(() => ID)
  @PrimaryColumn({ length: 255 })
  id: string;

  @Field(() => ID)
  @Column()
  movieId: string;

  @Field(() => MovieEntity)
  @OneToOne(() => MovieEntity, (movie) => movie.product)
  movie: MovieEntity;

  @Field(() => [PriceEntity])
  prices: PriceEntity[];

  @HideField()
  @OneToMany(() => ProductPriceEntity, (productPrice) => productPrice.product)
  pricesConnection: ProductPriceEntity[];
}
