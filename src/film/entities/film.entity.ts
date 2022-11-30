import { Field, ObjectType } from '@nestjs/graphql';
import { ChildEntity, Column, OneToOne } from 'typeorm';
import { VideoEntity } from '../../video/entities/video.entity';
import { MovieTypeEnum } from '@utils/enums';
import { MovieEntity } from '../../movie/entities/movie.entity';
import { FilterableField } from '@common/filter';

@ObjectType()
@ChildEntity(MovieTypeEnum.Film)
export class FilmEntity extends MovieEntity {
  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  releaseDate?: Date;

  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  videoId?: string;

  @Field(() => VideoEntity, { nullable: true })
  @OneToOne(() => VideoEntity, { nullable: true })
  video?: VideoEntity;
}
