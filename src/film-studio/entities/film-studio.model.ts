import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { FilmModel } from '../../film/entities/film.model';
import { StudioModel } from '../../studio/entities/studio.model';

@ObjectType()
@Entity('films_studios')
export class FilmStudioModel {
  @Field(() => ID)
  @PrimaryColumn()
  filmId!: string;

  @Field(() => ID)
  @PrimaryColumn()
  studioId!: number;

  @Field(() => FilmModel)
  @ManyToOne(() => FilmModel, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  film!: FilmModel;

  @Field(() => StudioModel)
  @ManyToOne(() => StudioModel, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  studio!: StudioModel;
}
