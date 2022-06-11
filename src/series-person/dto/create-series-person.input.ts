import { Field, InputType, Int } from '@nestjs/graphql';
import { SeriesPersonModel } from '../entities/series-person.model';
import { IsOptional, IsUUID, Length } from 'class-validator';
import { PersonTypeEnum } from '../../shared/person-type.enum';

@InputType()
export class CreateSeriesPersonInput implements Partial<SeriesPersonModel> {
  @Field()
  @IsUUID()
  seriesId!: string;

  @Field(() => Int)
  personId!: number;

  @Field({ nullable: true })
  @Length(2, 200)
  @IsOptional()
  role?: string;

  @Field(() => PersonTypeEnum)
  type!: PersonTypeEnum;
}
