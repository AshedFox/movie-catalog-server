import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CountryEntity } from '../../country/entities/country.entity';
import { StudioCountryEntity } from '../../studio-country/entities/studio-country.entity';
import { FilterableField } from '@common/filter';

@ObjectType('Studio')
@Entity('studios')
export class StudioEntity {
  @FilterableField(() => ID)
  @PrimaryGeneratedColumn({ type: 'int4' })
  id: number;

  @FilterableField()
  @Column({ length: 255 })
  @Index()
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
