import { ArgsType, Field } from '@nestjs/graphql';
import { GqlOffsetPagination } from '../../common/pagination';
import { IsOptional, IsUUID, Length } from 'class-validator';

@ArgsType()
export class GetSeasonsArgs extends GqlOffsetPagination {
  @Field({ nullable: true })
  @Length(1, 200)
  @IsOptional()
  searchTitle?: string;

  @Field({ nullable: true })
  @IsUUID('4')
  seriesId?: string;
}
