import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  Unique,
} from 'typeorm';
import { LanguageEntity } from '../../language/entities/language.entity';
import { MediaEntity } from '../../media/entities/media.entity';
import { VideoEntity } from '../../video/entities/video.entity';
import { FilterableField } from '@common/filter';

@ObjectType('Subtitles')
@Entity('subtitles')
@Unique(['videoId', 'languageId'])
export class SubtitlesEntity {
  @FilterableField(() => ID)
  @PrimaryGeneratedColumn({ type: 'int8' })
  id: number;

  @FilterableField(() => Int)
  @Column({ type: 'int4' })
  videoId: number;

  @Field(() => VideoEntity)
  @ManyToOne(() => VideoEntity)
  video: Relation<VideoEntity>;

  @FilterableField()
  @Column({ length: 3, type: 'char' })
  languageId: string;

  @Field(() => LanguageEntity)
  @ManyToOne(() => LanguageEntity)
  language: Relation<LanguageEntity>;

  @Field()
  @Column({ type: 'uuid' })
  fileId: string;

  @Field(() => MediaEntity)
  @ManyToOne(() => MediaEntity)
  file: Relation<MediaEntity>;
}
