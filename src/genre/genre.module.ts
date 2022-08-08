import { Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreResolver } from './genre.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreEntity } from './entities/genre.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GenreEntity])],
  providers: [GenreResolver, GenreService],
  exports: [GenreService],
})
export class GenreModule {}
