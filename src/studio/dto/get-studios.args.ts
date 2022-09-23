import { ArgsType, Field } from '@nestjs/graphql';
import { GqlOffsetPagination } from '../../common/pagination';
import { IsOptional, Length } from 'class-validator';

@ArgsType()
export class GetStudiosArgs extends GqlOffsetPagination {
  @Field({ nullable: true })
  @Length(1, 200)
  @IsOptional()
  searchName?: string;
}
