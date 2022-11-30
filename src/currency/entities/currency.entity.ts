import { ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { FilterableField } from '@common/filter';

@ObjectType()
@Entity('currencies')
export class CurrencyEntity {
  @FilterableField(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @FilterableField()
  @Column({ length: 3 })
  symbol: string;

  @FilterableField()
  @Column({ unique: true, length: 3 })
  code: string;
}
