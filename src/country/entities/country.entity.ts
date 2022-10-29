import { ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { FilterableField } from '../../common/filter';

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
  @Column({ unique: true })
  code: string;
}
