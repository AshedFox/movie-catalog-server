import { Module, forwardRef } from '@nestjs/common';
import { StudioService } from './studio.service';
import { StudioResolver } from './studio.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudioEntity } from './entities/studio.entity';
import { StudioCountryModule } from '../studio-country/studio-country.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudioEntity]),
    forwardRef(() => StudioCountryModule),
  ],
  providers: [StudioResolver, StudioService],
  exports: [StudioService],
})
export class StudioModule {}
