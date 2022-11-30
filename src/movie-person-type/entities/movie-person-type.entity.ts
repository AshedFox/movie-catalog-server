import { ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { FilterableField } from '@common/filter';

@ObjectType()
@Entity('movie_person_types')
export class MoviePersonTypeEntity {
  @FilterableField(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @FilterableField()
  @Column({ unique: true })
  name: string;
}
