import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomModule } from '../room/room.module';
import { RoomMovieEntity } from './entities/room-movie.entity';
import { MovieModule } from '../movie/movie.module';
import { RoomMovieResolver } from './room-movie.resolver';
import { RoomMovieService } from './room-movie.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomMovieEntity]),
    forwardRef(() => RoomModule),
    MovieModule,
  ],
  providers: [RoomMovieResolver, RoomMovieService],
  exports: [RoomMovieService],
})
export class RoomMovieModule {}
