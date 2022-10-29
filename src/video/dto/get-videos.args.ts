import { ArgsType } from '@nestjs/graphql';
import { GqlArgs } from '../../common/args';
import { VideoEntity } from '../entities/video.entity';

@ArgsType()
export class GetVideosArgs extends GqlArgs(VideoEntity) {}
