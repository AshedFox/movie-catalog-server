import { ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { FilterableField } from '@common/filter';

@ObjectType()
@Entity('age_restrictions')
export class AgeRestrictionEntity {
  @FilterableField(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @FilterableField()
  @Column({ unique: true })
  name: string;
}
