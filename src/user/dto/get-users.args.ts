import { ArgsType } from '@nestjs/graphql';
import { GqlOffsetPagination } from '../../common/pagination';

@ArgsType()
export class GetUsersArgs extends GqlOffsetPagination {}
