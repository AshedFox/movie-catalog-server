import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/pagination';
import { ImageEntity } from '../entities/image.entity';

@ObjectType()
export class PaginatedImages extends Paginated(ImageEntity) {}
