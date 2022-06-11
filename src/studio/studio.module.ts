import { Module } from '@nestjs/common';
import { StudioService } from './studio.service';
import { StudioResolver } from './studio.resolver';

@Module({
  providers: [StudioResolver, StudioService],
})
export class StudioModule {}
