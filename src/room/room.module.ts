import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomResolver } from './room.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './entities/room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoomEntity])],
  providers: [RoomResolver, RoomService],
  exports: [RoomService],
})
export class RoomModule {}
