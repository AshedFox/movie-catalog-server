import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CountryEntity } from '../../country/entities/country.entity';
import { FilterableField } from '@common/filter';

@ObjectType()
@Entity({ name: 'persons' })
export class PersonEntity {
  @FilterableField(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @FilterableField()
  @Column()
  name: string;

  @FilterableField(() => Int, { nullable: true })
  @Column({ nullable: true })
  countryId?: number;

  @Field(() => CountryEntity, { nullable: true })
  @ManyToOne(() => CountryEntity, { nullable: true })
  country?: CountryEntity;
}
