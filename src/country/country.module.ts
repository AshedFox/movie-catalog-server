import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryResolver } from './country.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryModel } from './entities/country.model';

@Module({
  imports: [TypeOrmModule.forFeature([CountryModel])],
  providers: [CountryResolver, CountryService],
  exports: [CountryService],
})
export class CountryModule {}
