import { Module } from '@nestjs/common';
import { StudioService } from './studio.service';
import { StudioResolver } from './studio.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudioModel } from './entities/studio.model';
import { StudioCountryModule } from '../studio-country/studio-country.module';

@Module({
  imports: [TypeOrmModule.forFeature([StudioModel]), StudioCountryModule],
  providers: [StudioResolver, StudioService],
  exports: [StudioService],
})
export class StudioModule {}
