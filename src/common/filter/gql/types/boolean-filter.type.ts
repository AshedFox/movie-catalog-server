import { Field, InputType } from '@nestjs/graphql';
import { BooleanFilterType } from '../../common';
import { IsBoolean, IsOptional } from 'class-validator';

@InputType()
export class BooleanFilter implements BooleanFilterType {
  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  eq?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  neq?: boolean;
}
