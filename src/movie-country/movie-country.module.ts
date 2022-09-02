import { forwardRef, Module } from '@nestjs/common';
import { MovieCountryService } from './movie-country.service';
import { MovieCountryResolver } from './movie-country.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieCountryEntity } from './entities/movie-country.entity';
import { MovieModule } from '../movie/movie.module';
import { CountryModule } from '../country/country.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MovieCountryEntity]),
    forwardRef(() => MovieModule),
    forwardRef(() => CountryModule),
  ],
  providers: [MovieCountryResolver, MovieCountryService],
  exports: [MovieCountryService],
})
export class MovieCountryModule {}
