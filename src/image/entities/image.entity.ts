import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('images')
export class ImageEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  url: string;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  width?: number;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  height?: number;
}
