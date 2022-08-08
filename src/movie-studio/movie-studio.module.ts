import { forwardRef, Module } from '@nestjs/common';
import { MovieStudioService } from './movie-studio.service';
import { MovieStudioResolver } from './movie-studio.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieStudioEntity } from './entities/movie-studio.entity';
import { StudioModule } from '../studio/studio.module';
import { MovieModule } from '../movie/movie.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MovieStudioEntity]),
    forwardRef(() => MovieModule),
    forwardRef(() => StudioModule),
  ],
  providers: [MovieStudioResolver, MovieStudioService],
  exports: [MovieStudioService],
})
export class MovieStudioModule {}
