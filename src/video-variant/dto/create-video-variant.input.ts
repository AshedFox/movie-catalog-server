import { Field, InputType, Int } from '@nestjs/graphql';
import { VideoVariantEntity } from '../entities/video-variant.entity';
import { VideoQualityEnum } from '@utils/enums/video-quality.enum';
import { IsEnum, Length } from 'class-validator';

@InputType()
export class CreateVideoVariantInput implements Partial<VideoVariantEntity> {
  @Field(() => Int)
  videoId: number;

  @Field(() => Int)
  fileId: number;

  @Field()
  @Length(5, 6)
  languageId: string;

  @Field(() => VideoQualityEnum)
  @IsEnum(VideoQualityEnum)
  quality: VideoQualityEnum;
}
