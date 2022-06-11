import { ArgsType } from '@nestjs/graphql';
import { PaginatedArgs } from '../../shared/paginated.args';

@ArgsType()
export class GetUsersArgs extends PaginatedArgs {}
