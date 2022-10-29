import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { ImageEntity } from '../../image/entities/image.entity';
import { FilterableField } from '../../common/filter';

@ObjectType()
@Entity('videos')
export class VideoEntity {
  @FilterableField(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @FilterableField()
  @Column()
  url: string;

  @FilterableField(() => Int)
  @Column({ type: 'int' })
  duration: number;

  @FilterableField(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  width?: number;

  @FilterableField(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  height?: number;

  @FilterableField()
  @Column()
  previewId: string;

  @Field(() => ImageEntity)
  @ManyToOne(() => ImageEntity)
  preview: ImageEntity;
}
