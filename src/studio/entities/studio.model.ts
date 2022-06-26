import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CountryModel } from '../../country/entities/country.model';
import { StudioCountryModel } from '../../studio-country/entities/studio-country.model';

@ObjectType()
@Entity({ name: 'studios' })
export class StudioModel {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  name!: string;

  @HideField()
  @OneToMany(
    () => StudioCountryModel,
    (studioCountry) => studioCountry.studioId,
  )
  countryConnection!: StudioCountryModel[];

  @Field(() => [CountryModel])
  countries: CountryModel[];
}
