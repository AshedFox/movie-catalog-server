import { GqlArgs } from '@common/args';
import { LanguageEntity } from '../entities/language.entity';
import { ArgsType } from '@nestjs/graphql';

@ArgsType()
export class GetLanguagesArgs extends GqlArgs(LanguageEntity) {}
