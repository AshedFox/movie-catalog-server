import { Field, HideField, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GenreModel } from '../../genre/entities/genre.model';
import { StudioModel } from '../../studio/entities/studio.model';
import { FilmPersonModel } from '../../film-person/entities/film-person.model';
import { AgeRestrictionEnum } from '../../shared/age-restriction.enum';
import { VideoModel } from '../../video/entities/video.model';
import { FilmGenreModel } from '../../film-genre/entities/film-genre.model';
import { FilmStudioModel } from '../../film-studio/entities/film-studio.model';

@ObjectType()
@Entity({ name: 'films' })
export class FilmModel {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column({ default: '' })
  description!: string;

  @Field(() => AgeRestrictionEnum)
  @Column({ type: 'enum', enum: AgeRestrictionEnum })
  ageRestriction!: AgeRestrictionEnum;

  @Field({ nullable: true })
  @Column({ nullable: true })
  releaseDate?: Date;

  @Field()
  @CreateDateColumn()
  publicationDate!: Date;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  duration?: number;

  @Field(() => [GenreModel])
  genres!: GenreModel[];

  @HideField()
  @OneToMany(() => FilmGenreModel, (filmGenre) => filmGenre.film)
  genresConnection!: FilmGenreModel[];

  @Field(() => [StudioModel])
  studios!: StudioModel[];

  @HideField()
  @OneToMany(() => FilmStudioModel, (filmStudio) => filmStudio.film)
  studiosConnection!: FilmStudioModel[];

  @Field(() => [FilmPersonModel])
  @OneToMany(() => FilmPersonModel, (filmPerson) => filmPerson.film)
  filmPersons!: FilmPersonModel[];

  @Field({ nullable: true })
  @Column({ nullable: true })
  videoId?: string;

  @Field(() => VideoModel, { nullable: true })
  @OneToOne(() => VideoModel, { nullable: true })
  video?: VideoModel;
}
