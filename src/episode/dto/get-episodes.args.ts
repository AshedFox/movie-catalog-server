import { ArgsType, Field } from '@nestjs/graphql';
import { PaginatedArgs } from '../../shared/paginated.args';
import { IsOptional, IsUUID, Length } from 'class-validator';

@ArgsType()
export class GetEpisodesArgs extends PaginatedArgs {
  @Field({ nullable: true })
  @Length(1, 200)
  @IsOptional()
  searchTitle?: string;

  @Field({ nullable: true })
  @IsUUID('4')
  @IsOptional()
  seasonId?: string;
}
