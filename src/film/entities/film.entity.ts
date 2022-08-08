import { Field, ObjectType } from '@nestjs/graphql';
import { ChildEntity, Column, OneToOne } from 'typeorm';
import { VideoEntity } from '../../video/entities/video.entity';
import { MovieTypeEnum } from '../../utils/enums/movie-type.enum';
import { MovieEntity } from '../../movie/entities/movie.entity';

@ObjectType()
@ChildEntity(MovieTypeEnum.Film)
export class FilmEntity extends MovieEntity {
  @Field({ nullable: true })
  @Column({ nullable: true })
  releaseDate?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  videoId?: string;

  @Field(() => VideoEntity, { nullable: true })
  @OneToOne(() => VideoEntity, { nullable: true })
  video?: VideoEntity;
}
