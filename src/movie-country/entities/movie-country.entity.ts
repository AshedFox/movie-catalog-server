import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { MovieEntity } from '../../movie/entities/movie.entity';
import { CountryEntity } from '../../country/entities/country.entity';

@ObjectType('MovieCountry')
@Entity('movies_countries')
export class MovieCountryEntity {
  @Field(() => ID)
  @PrimaryColumn({ type: 'character', length: 2 })
  countryId: string;

  @Field(() => ID)
  @PrimaryColumn()
  movieId: string;

  @Field(() => CountryEntity)
  @ManyToOne(() => CountryEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  country: CountryEntity;

  @Field(() => MovieEntity)
  @ManyToOne(() => MovieEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  movie: MovieEntity;
}
