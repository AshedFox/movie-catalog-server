import { Field, InputType } from '@nestjs/graphql';
import { AgeRestrictionEntity } from '../entities/age-restriction.entity';
import { MinLength } from 'class-validator';

@InputType()
export class CreateAgeRestrictionInput
  implements Partial<AgeRestrictionEntity>
{
  @Field()
  @MinLength(1)
  name: string;
}
