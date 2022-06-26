import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FilmModel } from '../../film/entities/film.model';
import { PersonModel } from '../../person/entities/person.model';
import { PersonTypeEnum } from '../../shared/person-type.enum';

@ObjectType()
@Entity({ name: 'films_persons' })
export class FilmPersonModel {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => FilmModel)
  @ManyToOne(() => FilmModel, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  film!: FilmModel;

  @Field(() => PersonModel)
  @ManyToOne(() => PersonModel, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  person!: PersonModel;

  @Field()
  @Column()
  filmId!: string;

  @Field()
  @Column()
  personId!: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  role?: string;

  @Field(() => PersonTypeEnum)
  @Column({ type: 'enum', enum: PersonTypeEnum })
  type!: PersonTypeEnum;
}
