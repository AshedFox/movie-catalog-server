import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../shared/paginated';
import { StudioModel } from '../entities/studio.model';

@ObjectType()
export class PaginatedStudios extends Paginated(StudioModel) {}
