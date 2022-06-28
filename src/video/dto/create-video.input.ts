import { InputType } from '@nestjs/graphql';
import { VideoModel } from '../entities/video.model';

@InputType()
export class CreateVideoInput implements Partial<VideoModel> {
  baseUrl!: string;
  height!: number;
  width!: number;
}
