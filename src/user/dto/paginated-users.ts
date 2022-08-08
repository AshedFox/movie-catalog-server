import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../utils/paginated.helper';
import { UserEntity } from '../entities/user.entity';

@ObjectType()
export class PaginatedUsers extends Paginated(UserEntity) {}
