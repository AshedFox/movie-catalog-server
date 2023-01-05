import { ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { FilterableField } from '@common/filter';

@ObjectType('MovieImageType')
@Entity('movie_image_types')
export class MovieImageTypeEntity {
  @FilterableField(() => ID)
  @PrimaryGeneratedColumn({ type: 'int2' })
  id: number;

  @FilterableField()
  @Column({ unique: true, length: 255 })
  name: string;
}
