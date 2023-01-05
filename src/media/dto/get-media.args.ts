import { ArgsType } from '@nestjs/graphql';
import { GqlArgs } from '@common/args';
import { MediaEntity } from '../entities/media.entity';

@ArgsType()
export class GetMediaArgs extends GqlArgs(MediaEntity) {}
