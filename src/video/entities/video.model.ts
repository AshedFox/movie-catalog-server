import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, HideField, ID, Int, ObjectType } from '@nestjs/graphql';
import { QualityModel } from '../../quality/entities/quality.model';
import { VideoQualityModel } from '../../video-quality/entities/video-quality.model';

@ObjectType()
@Entity('videos')
export class VideoModel {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column()
  baseUrl!: string;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  width?: number;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  height?: number;

  @Field(() => [QualityModel])
  qualities!: QualityModel[];

  @HideField()
  @OneToMany(() => VideoQualityModel, (videoQuality) => videoQuality.video)
  qualitiesConnection!: VideoQualityModel[];
}
