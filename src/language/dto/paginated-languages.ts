import { Paginated } from '@common/pagination/offset';
import { LanguageEntity } from '../entities/language.entity';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaginatedLanguages extends Paginated(LanguageEntity) {}
