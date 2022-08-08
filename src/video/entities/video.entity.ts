import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { ImageEntity } from '../../image/entities/image.entity';

@ObjectType()
@Entity('videos')
export class VideoEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  url: string;

  @Field(() => Int)
  @Column({ type: 'int' })
  duration: number;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  width?: number;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  height?: number;

  @Field()
  @Column()
  previewId: string;

  @Field(() => ImageEntity)
  @ManyToOne(() => ImageEntity)
  preview: ImageEntity;
}
