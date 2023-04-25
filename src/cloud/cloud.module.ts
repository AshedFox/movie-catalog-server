import { Module } from '@nestjs/common';
import { GoogleCloudService } from './google-cloud.service';

@Module({
  imports: [],
  providers: [GoogleCloudService],
  exports: [GoogleCloudService],
})
export class CloudModule {}
