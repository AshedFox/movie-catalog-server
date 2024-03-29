import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/pagination/offset';
import { UserEntity } from '../entities/user.entity';

@ObjectType()
export class PaginatedUsers extends Paginated(UserEntity) {}
