import { Module } from '@nestjs/common';
import { MoviePersonService } from './movie-person.service';
import { MoviePersonResolver } from './movie-person.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviePersonEntity } from './entities/movie-person.entity';
import { MovieModule } from '../movie/movie.module';
import { PersonModule } from '../person/person.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MoviePersonEntity]),
    MovieModule,
    PersonModule,
  ],
  providers: [MoviePersonResolver, MoviePersonService],
  exports: [MoviePersonService],
})
export class MoviePersonModule {}
