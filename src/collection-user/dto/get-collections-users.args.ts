import { ArgsType } from '@nestjs/graphql';
import { GqlArgs } from '@common/args';
import { CollectionUserEntity } from '../entities/collection-user.entity';

@ArgsType()
export class GetCollectionsUsersArgs extends GqlArgs(CollectionUserEntity) {}
