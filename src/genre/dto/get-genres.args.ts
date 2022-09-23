import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, Length } from 'class-validator';
import { GqlOffsetPagination } from '../../common/pagination';

@ArgsType()
export class GetGenresArgs extends GqlOffsetPagination {
  @Field({ nullable: true })
  @Length(1, 200)
  @IsOptional()
  searchName?: string;
}
