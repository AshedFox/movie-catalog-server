import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { StudioModel } from '../../studio/entities/studio.model';
import { CountryModel } from '../../country/entities/country.model';

@ObjectType()
@Entity('studios_countries')
export class StudioCountryModel {
  @Field(() => ID)
  @PrimaryColumn()
  studioId!: number;

  @Field(() => ID)
  @PrimaryColumn()
  countryId!: number;

  @Field(() => StudioModel)
  @ManyToOne(() => StudioModel, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  studio!: StudioModel;

  @Field(() => CountryModel)
  @ManyToOne(() => CountryModel, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  country!: CountryModel;
}
