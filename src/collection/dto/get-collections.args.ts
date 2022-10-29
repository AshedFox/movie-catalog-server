import { ArgsType } from '@nestjs/graphql';
import { GqlArgs } from '../../common/args';
import { CollectionEntity } from '../entities/collection.entity';

@ArgsType()
export class GetCollectionsArgs extends GqlArgs(CollectionEntity) {}
