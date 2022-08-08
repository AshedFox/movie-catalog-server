import { ArgsType } from '@nestjs/graphql';
import { PaginatedArgs } from '../../utils/paginated.args';

@ArgsType()
export class GetUsersArgs extends PaginatedArgs {}
