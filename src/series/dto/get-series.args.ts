import { ArgsType } from '@nestjs/graphql';
import { GetMoviesArgs } from '../../movie/dto/get-movies.args';

@ArgsType()
export class GetSeriesArgs extends GetMoviesArgs {}
