import { ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { FilterableField } from '@common/filter';

@ObjectType()
@Entity('images')
export class ImageEntity {
  @FilterableField(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @FilterableField()
  @Column({ unique: true })
  url: string;

  @FilterableField(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  width?: number;

  @FilterableField(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  height?: number;
}
