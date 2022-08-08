import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, Length } from 'class-validator';
import { GetMoviesArgs } from '../../movie/dto/get-movies.args';

@ArgsType()
export class GetFilmsArgs extends GetMoviesArgs {
  @Field({ nullable: true })
  @Length(1, 200)
  @IsOptional()
  searchTitle?: string;
}
