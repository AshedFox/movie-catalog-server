import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, Length } from 'class-validator';

@ArgsType()
export class GetCollectionsArgs {
  @Field({ nullable: true })
  @Length(1, 200)
  @IsOptional()
  searchName?: string;
}
