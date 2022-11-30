import { CurrencyEntity } from '../../currency/entities/currency.entity';
import { ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FilterableField, FilterableRelation } from '@common/filter';

@ObjectType()
@Entity('countries')
export class CountryEntity {
  @FilterableField(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @FilterableField()
  @Column()
  name: string;

  @FilterableField()
  @Column({ unique: true, length: 2 })
  code: string;

  @FilterableField()
  @Column()
  currencyId: number;

  @FilterableRelation(() => CurrencyEntity)
  @ManyToOne(() => CurrencyEntity)
  currency: CountryEntity;
}
