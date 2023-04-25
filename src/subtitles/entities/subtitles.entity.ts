import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LanguageEntity } from '../../language/entities/language.entity';
import { MediaEntity } from '../../media/entities/media.entity';
import { VideoEntity } from '../../video/entities/video.entity';
import { FilterableField } from '@common/filter';

@ObjectType('Subtitles')
@Entity('subtitles')
export class SubtitlesEntity {
  @FilterableField()
  @PrimaryGeneratedColumn({ type: 'int8' })
  id: number;

  @FilterableField(() => Int)
  @Column({ type: 'int4' })
  videoId: number;

  @Field(() => VideoEntity)
  @ManyToOne(() => VideoEntity)
  video: VideoEntity;

  @FilterableField()
  @Column()
  languageId: string;

  @Field(() => LanguageEntity)
  @ManyToOne(() => LanguageEntity)
  language: LanguageEntity;

  @Field()
  @Column({ type: 'uuid' })
  fileId: string;

  @Field(() => MediaEntity)
  @ManyToOne(() => MediaEntity)
  file: MediaEntity;
}
