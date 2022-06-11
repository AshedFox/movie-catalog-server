import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, IsUUID, Length } from 'class-validator';
import { PersonTypeEnum } from '../../shared/person-type.enum';
import { FilmPersonModel } from '../entities/film-person.model';

@InputType()
export class CreateFilmPersonInput implements Partial<FilmPersonModel> {
  @Field()
  @IsUUID()
  filmId!: string;

  @Field(() => Int)
  personId!: number;

  @Field({ nullable: true })
  @Length(2, 200)
  @IsOptional()
  role?: string;

  @Field(() => PersonTypeEnum)
  type!: PersonTypeEnum;
}
