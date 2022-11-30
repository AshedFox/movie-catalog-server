import { ArgsType } from '@nestjs/graphql';
import { GqlArgs } from '@common/args';
import { PersonEntity } from '../entities/person.entity';

@ArgsType()
export class GetPersonsArgs extends GqlArgs(PersonEntity) {}
