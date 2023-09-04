import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, PrimaryColumn, Relation } from 'typeorm';
import { MovieEntity } from '../../movie/entities/movie.entity';
import { CountryEntity } from '../../country/entities/country.entity';
import { FilterableField, FilterableRelation } from '@common/filter';

@ObjectType('MovieCountry')
@Entity('movies_countries')
export class MovieCountryEntity {
  @FilterableField(() => ID)
  @PrimaryColumn({ type: 'character', length: 2 })
  countryId: string;

  @FilterableField(() => ID)
  @PrimaryColumn()
  movieId: string;

  @FilterableRelation(() => CountryEntity)
  @ManyToOne(() => CountryEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  country: Relation<CountryEntity>;

  @Field(() => MovieEntity)
  @ManyToOne(() => MovieEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  movie: Relation<MovieEntity>;
}
