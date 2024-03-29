import { Field, ObjectType } from '@nestjs/graphql';
import { ChildEntity, Column, Index, OneToOne, Relation } from 'typeorm';
import { VideoEntity } from '../../video/entities/video.entity';
import { MovieTypeEnum } from '@utils/enums';
import { MovieEntity } from '../../movie/entities/movie.entity';
import { FilterableField } from '@common/filter';

@ObjectType('Film', {
  implements: [MovieEntity],
})
@ChildEntity(MovieTypeEnum.Film)
export class FilmEntity extends MovieEntity {
  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  @Index({ where: 'release_date IS NOT NULL' })
  releaseDate?: Date;

  @FilterableField({ nullable: true })
  @Column({ nullable: true, type: 'int4' })
  @Index({ where: 'video_id IS NOT NULL' })
  videoId?: number;

  @Field(() => VideoEntity, { nullable: true })
  @OneToOne(() => VideoEntity, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  video?: Relation<VideoEntity>;
}
