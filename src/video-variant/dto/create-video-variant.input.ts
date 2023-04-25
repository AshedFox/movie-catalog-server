import { Field, InputType, Int } from '@nestjs/graphql';
import { VideoVariantEntity } from '../entities/video-variant.entity';
import { VideoProfileEnum } from '@utils/enums/video-profile.enum';
import { IsEnum, IsUUID } from 'class-validator';

@InputType()
export class CreateVideoVariantInput implements Partial<VideoVariantEntity> {
  @Field(() => Int)
  videoId: number;

  @Field()
  @IsUUID()
  mediaId: string;

  @Field(() => VideoProfileEnum)
  @IsEnum(VideoProfileEnum)
  profile: VideoProfileEnum;
}
