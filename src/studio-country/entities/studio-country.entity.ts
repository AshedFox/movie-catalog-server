import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { StudioEntity } from '../../studio/entities/studio.entity';
import { CountryEntity } from '../../country/entities/country.entity';

@ObjectType()
@Entity('studios_countries')
export class StudioCountryEntity {
  @Field(() => ID)
  @PrimaryColumn()
  studioId: number;

  @Field(() => ID)
  @PrimaryColumn()
  countryId: number;

  @Field(() => StudioEntity)
  @ManyToOne(() => StudioEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  studio: StudioEntity;

  @Field(() => CountryEntity)
  @ManyToOne(() => CountryEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  country: CountryEntity;
}
