import { ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { FilterableField } from '@common/filter';

@ObjectType('Currency')
@Entity('currencies')
export class CurrencyEntity {
  @FilterableField(() => ID)
  @PrimaryColumn({ type: 'char', length: 3 })
  id: string;

  @FilterableField()
  @Column({ length: 3 })
  symbol: string;

  @FilterableField()
  @Column({ length: 255 })
  name: string;
}
