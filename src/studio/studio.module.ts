import { Module } from '@nestjs/common';
import { StudioService } from './studio.service';
import { StudioResolver } from './studio.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudioModel } from './entities/studio.model';

@Module({
  imports: [TypeOrmModule.forFeature([StudioModel])],
  providers: [StudioResolver, StudioService],
  exports: [StudioService],
})
export class StudioModule {}
