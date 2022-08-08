import { ArgsType, Field } from '@nestjs/graphql';
import { PaginatedArgs } from '../../utils/paginated.args';
import { IsOptional, IsUUID } from 'class-validator';

@ArgsType()
export class GetReviewsArgs extends PaginatedArgs {
  @Field({ nullable: true })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @Field({ nullable: true })
  @IsUUID()
  @IsOptional()
  movieId?: string;
}
