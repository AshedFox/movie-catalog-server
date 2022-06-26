import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { VideoModel } from '../../video/entities/video.model';
import { QualityModel } from '../../quality/entities/quality.model';

@ObjectType()
@Entity('videos_qualities')
export class VideoQualityModel {
  @Field(() => ID)
  @PrimaryColumn()
  videoId!: string;

  @Field(() => ID)
  @PrimaryColumn()
  qualityId!: number;

  @Field(() => VideoModel)
  @ManyToOne(() => VideoModel, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  video!: VideoModel;

  @Field(() => QualityModel)
  @ManyToOne(() => QualityModel, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  quality!: QualityModel;
}
