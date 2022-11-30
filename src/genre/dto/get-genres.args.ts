import { ArgsType } from '@nestjs/graphql';
import { GqlArgs } from '@common/args';
import { GenreEntity } from '../entities/genre.entity';

@ArgsType()
export class GetGenresArgs extends GqlArgs(GenreEntity) {}
