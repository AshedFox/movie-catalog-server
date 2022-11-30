import { ArgsType } from '@nestjs/graphql';
import { GqlArgs } from '@common/args';
import { UserEntity } from '../entities/user.entity';

@ArgsType()
export class GetUsersArgs extends GqlArgs(UserEntity) {}
