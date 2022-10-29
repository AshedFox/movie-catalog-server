import { ArgsType } from '@nestjs/graphql';
import { GqlArgs } from '../../common/args';
import { SeriesEntity } from '../entities/series.entity';

@ArgsType()
export class GetSeriesArgs extends GqlArgs(SeriesEntity) {}
