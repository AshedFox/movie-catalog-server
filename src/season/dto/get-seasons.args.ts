import { ArgsType } from '@nestjs/graphql';
import { GqlArgs } from '@common/args';
import { SeasonEntity } from '../entities/season.entity';

@ArgsType()
export class GetSeasonsArgs extends GqlArgs(SeasonEntity) {}
