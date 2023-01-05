import { CurrencyEntity } from '../../currency/entities/currency.entity';
import { ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';
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
  @Column()
  @Index()
  currencyId: number;

  @FilterableRelation(() => CurrencyEntity)
  @ManyToOne(() => CurrencyEntity, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  currency: CurrencyEntity;

  @FilterableField()
  @Column()
  @Index()
  languageId: string;

  @FilterableRelation(() => LanguageEntity)
  @ManyToOne(() => LanguageEntity, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  language: LanguageEntity;
}
