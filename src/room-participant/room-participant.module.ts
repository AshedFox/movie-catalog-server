import { forwardRef, Module } from '@nestjs/common';
import { RoomParticipantService } from './room-participant.service';
import { RoomParticipantResolver } from './room-participant.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomParticipantEntity } from './entities/room-participant.entity';
import { RoomModule } from '../room/room.module';
import { StudioModule } from '../studio/studio.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomParticipantEntity]),
    forwardRef(() => RoomModule),
    forwardRef(() => StudioModule),
  ],
  providers: [RoomParticipantResolver, RoomParticipantService],
  exports: [RoomParticipantService],
})
export class RoomParticipantModule {}
