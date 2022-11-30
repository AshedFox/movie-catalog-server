import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/pagination';
import { StudioEntity } from '../entities/studio.entity';

@ObjectType()
export class PaginatedStudios extends Paginated(StudioEntity) {}
