import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../utils/paginated.helper';
import { StudioEntity } from '../entities/studio.entity';

@ObjectType()
export class PaginatedStudios extends Paginated(StudioEntity) {}
