import { ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { FilterableField } from '@common/filter';

@ObjectType('Language')
@Entity('languages')
export class LanguageEntity {
  @FilterableField(() => ID)
  @PrimaryColumn({ length: 6, type: 'varchar' })
  id: string;

  @FilterableField()
  @Column({ length: 2, type: 'char' })
  languageCode: string;

  @FilterableField()
  @Column({ length: 3, type: 'varchar' })
  countryCode: string;

  @FilterableField()
  @Column({ length: 255 })
  name: string;
}
