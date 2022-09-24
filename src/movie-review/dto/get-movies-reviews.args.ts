import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, IsUUID } from 'class-validator';
import { GqlOffsetPagination } from '../../common/pagination';

@ArgsType()
export class GetMoviesReviewsArgs extends GqlOffsetPagination {
  @Field({ nullable: true })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @Field({ nullable: true })
  @IsUUID()
  @IsOptional()
  movieId?: string;
}
