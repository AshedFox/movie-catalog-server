import { forwardRef, Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomResolver } from './room.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './entities/room.entity';
import { CaslModule } from '../casl/casl.module';
import { RoomParticipantModule } from '../room-participant/room-participant.module';
import { JwtModule } from '@nestjs/jwt';
import { RoomMovieModule } from '../room-movie/room-movie.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomEntity]),
    CaslModule,
    forwardRef(() => RoomParticipantModule),
    forwardRef(() => RoomMovieModule),
    JwtModule,
  ],
  providers: [RoomResolver, RoomService],
  exports: [RoomService],
})
export class RoomModule {}
