import { ArgsType } from '@nestjs/graphql';
import { GqlArgs } from '@common/args';
import { TrailerEntity } from '../entities/trailer.entity';

@ArgsType()
export class GetTrailersArgs extends GqlArgs(TrailerEntity) {}
