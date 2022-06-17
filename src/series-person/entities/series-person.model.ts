import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PersonModel } from '../../person/entities/person.model';
import { PersonTypeEnum } from '../../shared/person-type.enum';
import { SeriesModel } from '../../series/entities/series.model';

@ObjectType()
@Entity({ name: 'series_persons' })
export class SeriesPersonModel {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => SeriesModel)
  @ManyToOne(() => SeriesModel)
  series!: SeriesModel;

  @Field(() => PersonModel)
  @ManyToOne(() => PersonModel)
  person!: PersonModel;

  @Field()
  @Column()
  seriesId!: string;

  @Field()
  @Column()
  personId!: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  role?: string;

  @Field(() => PersonTypeEnum)
  @Column({ type: 'enum', enum: PersonTypeEnum })
  type!: PersonTypeEnum;
}
