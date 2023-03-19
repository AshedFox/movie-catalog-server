import { Module } from '@nestjs/common';
import { RoomVideoService } from './room-video.service';
import { RoomVideoResolver } from './room-video.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomVideoEntity } from './entities/room-video.entity';
import { RoomModule } from '../room/room.module';
import { VideoModule } from '../video/video.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomVideoEntity]),
    RoomModule,
    VideoModule,
  ],
  providers: [RoomVideoResolver, RoomVideoService],
  exports: [RoomVideoService],
})
export class RoomVideoModule {}
