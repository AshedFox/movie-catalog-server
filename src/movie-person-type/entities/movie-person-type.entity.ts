import { ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { FilterableField } from '@common/filter';

@ObjectType('MoviePersonType')
@Entity('movie_person_types')
export class MoviePersonTypeEntity {
  @FilterableField(() => ID)
  @PrimaryGeneratedColumn({ type: 'int2' })
  id: number;

  @FilterableField()
  @Column({ unique: true, length: 255 })
  name: string;
}
