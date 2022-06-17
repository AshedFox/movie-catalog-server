import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GenreModel } from '../../genre/entities/genre.model';
import { StudioModel } from '../../studio/entities/studio.model';
import { FilmPersonModel } from '../../film-person/entities/film-person.model';
import { AgeRestrictionEnum } from '../../shared/age-restriction.enum';

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
  premierDate?: Date;

  @Field()
  @CreateDateColumn()
  publicationDate!: Date;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  duration?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  videoUrl?: string;

  @Field(() => [GenreModel])
  @ManyToMany(() => GenreModel, { lazy: true })
  @JoinTable({ name: 'films_genres' })
  genres!: Promise<GenreModel[]>;

  @Field(() => [StudioModel])
  @ManyToMany(() => StudioModel, { lazy: true })
  @JoinTable({ name: 'films_studios' })
  studios!: Promise<StudioModel[]>;

  @Field(() => [FilmPersonModel])
  @OneToMany(() => FilmPersonModel, (filmPerson) => filmPerson.film, {
    lazy: true,
  })
  persons!: Promise<FilmPersonModel[]>;
}
