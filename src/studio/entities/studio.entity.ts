import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CountryEntity } from '../../country/entities/country.entity';
import { StudioCountryEntity } from '../../studio-country/entities/studio-country.entity';
import { FilterableField } from '../../common/filter';

@ObjectType()
@Entity({ name: 'studios' })
export class StudioEntity {
  @FilterableField(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @FilterableField()
  @Column()
  name: string;

  @HideField()
  @OneToMany(
    () => StudioCountryEntity,
    (studioCountry) => studioCountry.studioId,
  )
  countryConnection: StudioCountryEntity[];

  @Field(() => [CountryEntity])
  countries: CountryEntity[];
}
