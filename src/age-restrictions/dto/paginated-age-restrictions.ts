import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/pagination';
import { AgeRestrictionEntity } from '../entities/age-restriction.entity';

@ObjectType()
export class PaginatedAgeRestrictions extends Paginated(AgeRestrictionEntity) {}
