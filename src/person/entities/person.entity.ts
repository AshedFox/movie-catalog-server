import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CountryEntity } from '../../country/entities/country.entity';

@ObjectType()
@Entity({ name: 'persons' })
export class PersonEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  countryId?: number;

  @Field(() => CountryEntity, { nullable: true })
  @ManyToOne(() => CountryEntity, { nullable: true })
  country?: CountryEntity;
}
