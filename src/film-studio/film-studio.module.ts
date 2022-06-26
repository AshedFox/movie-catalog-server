import { forwardRef, Module } from '@nestjs/common';
import { FilmStudioService } from './film-studio.service';
import { FilmStudioResolver } from './film-studio.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmStudioModel } from './entities/film-studio.model';
import { FilmModule } from '../film/film.module';
import { StudioModule } from '../studio/studio.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FilmStudioModel]),
    forwardRef(() => FilmModule),
    forwardRef(() => StudioModule),
  ],
  providers: [FilmStudioResolver, FilmStudioService],
  exports: [FilmStudioService],
})
export class FilmStudioModule {}
