import { CurrencyEntity } from '../../currency/entities/currency.entity';
import { ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { FilterableField, FilterableRelation } from '@common/filter';
import { LanguageEntity } from '../../language/entities/language.entity';

@ObjectType('Country')
@Entity('countries')
export class CountryEntity {
  @FilterableField(() => ID)
  @PrimaryColumn({ type: 'char', length: 2 })
  id: string;

  @FilterableField()
  @Column({ length: 255 })
  name: string;

  @FilterableField()
  @Column({ type: 'char', length: 3 })
  @Index()
  currencyId: string;

  @FilterableRelation(() => CurrencyEntity)
  @ManyToOne(() => CurrencyEntity, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  currency: Relation<CurrencyEntity>;

  @FilterableField()
  @Column({ length: 3, type: 'char' })
  @Index()
  languageId: string;

  @FilterableRelation(() => LanguageEntity)
  @ManyToOne(() => LanguageEntity, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  language: Relation<LanguageEntity>;
}
