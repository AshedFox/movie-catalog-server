import { Module } from '@nestjs/common';
import { QualityService } from './quality.service';
import { QualityResolver } from './quality.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QualityModel } from './entities/quality.model';

@Module({
  imports: [TypeOrmModule.forFeature([QualityModel])],
  providers: [QualityResolver, QualityService],
  exports: [QualityService],
})
export class QualityModule {}
