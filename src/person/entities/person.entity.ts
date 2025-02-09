import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { CountryEntity } from '../../country/entities/country.entity';
import { FilterableField } from '@common/filter';
import { MediaEntity } from '../../media/entities/media.entity';

@ObjectType('Person')
@Entity('persons')
export class PersonEntity {
  @FilterableField(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @FilterableField()
  @Column({ length: 255 })
  @Index()
  name: string;

  @FilterableField({ nullable: true })
  @Column({ nullable: true, type: 'char', length: 2 })
  @Index({ where: 'country_id IS NOT NULL' })
  countryId?: string;

  @Field(() => CountryEntity, { nullable: true })
  @ManyToOne(() => CountryEntity, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  country?: Relation<CountryEntity>;

  @FilterableField({ nullable: true })
  @Column({ nullable: true, type: 'uuid' })
  @Index({ where: 'image_id IS NOT NULL' })
  imageId?: string;

  @Field(() => MediaEntity, { nullable: true })
  @ManyToOne(() => MediaEntity, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  image?: Relation<MediaEntity>;
}
