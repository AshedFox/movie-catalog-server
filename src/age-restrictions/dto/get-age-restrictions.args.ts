import { GqlArgs } from '@common/args';
import { ArgsType } from '@nestjs/graphql';
import { AgeRestrictionEntity } from '../entities/age-restriction.entity';

@ArgsType()
export class GetAgeRestrictionsArgs extends GqlArgs(AgeRestrictionEntity) {}
