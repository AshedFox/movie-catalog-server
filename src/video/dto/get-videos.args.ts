import { GqlArgs } from '@common/args';
import { VideoEntity } from '../entities/video.entity';
import { ArgsType } from '@nestjs/graphql';

@ArgsType()
export class GetVideosArgs extends GqlArgs(VideoEntity) {}
