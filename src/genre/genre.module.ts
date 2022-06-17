import { Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreResolver } from './genre.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreModel } from './entities/genre.model';

@Module({
  imports: [TypeOrmModule.forFeature([GenreModel])],
  providers: [GenreResolver, GenreService],
  exports: [GenreService],
})
export class GenreModule {}
