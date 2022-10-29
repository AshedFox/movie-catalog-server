import { ArgsType } from '@nestjs/graphql';
import { GqlArgs } from '../../common/args';
import { CountryEntity } from '../entities/country.entity';

@ArgsType()
export class GetCountriesArgs extends GqlArgs(CountryEntity) {}
