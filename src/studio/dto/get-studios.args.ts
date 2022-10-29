import { ArgsType } from '@nestjs/graphql';
import { GqlArgs } from '../../common/args';
import { StudioEntity } from '../entities/studio.entity';

@ArgsType()
export class GetStudiosArgs extends GqlArgs(StudioEntity) {}
