import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FilterableField } from '@common/filter';
import { VideoVariantEntity } from '../../video-variant/entities/video-variant.entity';
import { SubtitlesEntity } from '../../subtitles/entities/subtitles.entity';
import { MediaEntity } from '../../media/entities/media.entity';
import { VideoAudioEntity } from '../../video-audio/entities/video-audio.entity';

@ObjectType('Video')
@Entity('videos')
export class VideoEntity {
  @FilterableField(() => ID)
  @PrimaryGeneratedColumn({ type: 'int4' })
  id: number;

  @Field({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  manifestMediaId?: string;

  @Field(() => MediaEntity, { nullable: true })
  @ManyToOne(() => MediaEntity, {
    nullable: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  manifestMedia?: MediaEntity;

  @Field(() => [VideoVariantEntity])
  @OneToMany(() => VideoVariantEntity, (videoVariant) => videoVariant.videoId)
  variants: VideoVariantEntity[];

  @Field(() => [VideoAudioEntity])
  @OneToMany(() => VideoAudioEntity, (videoAudio) => videoAudio.video)
  audios: VideoAudioEntity[];

  @Field(() => [SubtitlesEntity])
  @OneToMany(() => SubtitlesEntity, (subtitles) => subtitles.videoId)
  subtitles: SubtitlesEntity[];
}
