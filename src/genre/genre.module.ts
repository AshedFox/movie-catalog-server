import { Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreResolver } from './genre.resolver';

@Module({
  providers: [GenreResolver, GenreService],
  exports: [GenreService],
})
export class GenreModule {}
