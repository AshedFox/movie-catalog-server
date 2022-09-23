import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, IsUUID, Length } from 'class-validator';
import { GqlOffsetPagination } from '../../common/pagination';

@ArgsType()
export class GetEpisodesArgs extends GqlOffsetPagination {
  @Field({ nullable: true })
  @Length(1, 200)
  @IsOptional()
  searchTitle?: string;

  @Field({ nullable: true })
  @IsUUID('4')
  @IsOptional()
  seasonId?: string;

  @Field({ nullable: true })
  @IsUUID('4')
  @IsOptional()
  seriesId?: string;
}
