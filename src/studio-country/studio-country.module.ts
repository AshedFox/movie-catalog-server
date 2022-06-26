import { forwardRef, Module } from '@nestjs/common';
import { StudioCountryService } from './studio-country.service';
import { StudioCountryResolver } from './studio-country.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudioCountryModel } from './entities/studio-country.model';
import { CountryModule } from '../country/country.module';
import { StudioModule } from '../studio/studio.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudioCountryModel]),
    forwardRef(() => CountryModule),
    forwardRef(() => StudioModule),
  ],
  providers: [StudioCountryResolver, StudioCountryService],
  exports: [StudioCountryService],
})
export class StudioCountryModule {}
