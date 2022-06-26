import { Field, InputType } from '@nestjs/graphql';
import { QualityModel } from '../entities/quality.model';
import { MinLength } from 'class-validator';

@InputType()
export class CreateQualityInput implements Partial<QualityModel> {
  @Field()
  @MinLength(1)
  name!: string;
}
