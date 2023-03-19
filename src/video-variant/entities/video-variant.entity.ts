import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MediaEntity } from '../../media/entities/media.entity';
import { VideoQualityEnum } from '@utils/enums/video-quality.enum';
import { VideoEntity } from '../../video/entities/video.entity';
import { LanguageEntity } from '../../language/entities/language.entity';
import { FilterableField } from '@common/filter';

@ObjectType('VideoVariant')
@Entity('videos_variants')
export class VideoVariantEntity {
  @FilterableField()
  @PrimaryGeneratedColumn({ type: 'int8' })
  id: number;

  @FilterableField(() => Int)
  @Column({ type: 'int4' })
  videoId: number;

  @Field(() => VideoEntity)
  @ManyToOne(() => VideoEntity)
  video: VideoEntity;

  @Field(() => Int)
  @Column({ type: 'int8' })
  fileId: number;

  @Field(() => MediaEntity)
  @ManyToOne(() => MediaEntity)
  file: MediaEntity;

  @FilterableField()
  @Column()
  languageId: string;

  @Field(() => LanguageEntity)
  @ManyToOne(() => LanguageEntity)
  language: LanguageEntity;

  @FilterableField(() => VideoQualityEnum)
  @Column({
    type: 'enum',
    enum: VideoQualityEnum,
    enumName: 'video_quality_enum',
  })
  quality: VideoQualityEnum;
}
