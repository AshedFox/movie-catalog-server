import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../shared/paginated';
import { UserModel } from '../entities/user.model';

@ObjectType()
export class PaginatedUsers extends Paginated(UserModel) {}
