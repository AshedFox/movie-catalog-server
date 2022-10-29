import { ArgsType } from '@nestjs/graphql';
import { GqlArgs } from '../../common/args';
import { FilmEntity } from '../entities/film.entity';

@ArgsType()
export class GetFilmsArgs extends GqlArgs(FilmEntity) {}
