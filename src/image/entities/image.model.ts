import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('images')
export class ImageModel {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column({ unique: true })
  baseUrl!: string;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  width?: number;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  height?: number;
}
