import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { ImageModel } from '../../image/entities/image.model';
import { FilmModel } from '../../film/entities/film.model';

@ObjectType()
@Entity('films_posters')
export class FilmPosterModel {
  @Field(() => ID)
  @PrimaryColumn()
  imageId!: string;

  @Field(() => ID)
  @PrimaryColumn()
  filmId!: string;

  @Field(() => ImageModel)
  @ManyToOne(() => ImageModel, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  image!: ImageModel;

  @Field(() => FilmModel)
  @ManyToOne(() => FilmModel, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  film!: FilmModel;
}
