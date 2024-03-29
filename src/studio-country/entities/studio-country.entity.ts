import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, PrimaryColumn, Relation } from 'typeorm';
import { StudioEntity } from '../../studio/entities/studio.entity';
import { CountryEntity } from '../../country/entities/country.entity';

@ObjectType('StudioCountry')
@Entity('studios_countries')
export class StudioCountryEntity {
  @Field(() => ID)
  @PrimaryColumn()
  studioId: number;

  @Field(() => ID)
  @PrimaryColumn({ type: 'char', length: 2 })
  countryId: string;

  @Field(() => StudioEntity)
  @ManyToOne(() => StudioEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  studio: Relation<StudioEntity>;

  @Field(() => CountryEntity)
  @ManyToOne(() => CountryEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  country: Relation<CountryEntity>;
}
