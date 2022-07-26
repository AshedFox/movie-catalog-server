import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('videos')
export class VideoModel {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column()
  url!: string;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  width?: number;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  height?: number;
}
