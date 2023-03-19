import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FilterableField } from '@common/filter';
import { VideoVariantEntity } from '../../video-variant/entities/video-variant.entity';
import { SubtitlesEntity } from '../../subtitles/entities/subtitles.entity';

@ObjectType('Video')
@Entity('videos')
export class VideoEntity {
  @FilterableField(() => ID)
  @PrimaryGeneratedColumn({ type: 'int4' })
  id: number;

  @Field(() => [VideoVariantEntity])
  @OneToMany(() => VideoVariantEntity, (videoVariant) => videoVariant.videoId)
  variants: VideoVariantEntity[];

  @Field(() => [SubtitlesEntity])
  @OneToMany(() => SubtitlesEntity, (subtitles) => subtitles.videoId)
  subtitles: SubtitlesEntity[];
}
