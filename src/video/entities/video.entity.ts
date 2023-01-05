import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MediaEntity } from '../../media/entities/media.entity';

@ObjectType('Video')
@Entity('videos')
export class VideoEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: 'int4' })
  id: number;

  @Field()
  @Column({ type: 'int8' })
  fileId: number;

  @Field(() => MediaEntity)
  @ManyToOne(() => MediaEntity)
  file: MediaEntity;
}
