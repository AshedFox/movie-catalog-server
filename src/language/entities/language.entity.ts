import { ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { FilterableField } from '@common/filter';

@ObjectType('Language')
@Entity('languages')
export class LanguageEntity {
  @FilterableField(() => ID)
  @PrimaryColumn({ length: 3, type: 'char' })
  id: string;

  @FilterableField()
  @Column({ length: 255 })
  name: string;
}
