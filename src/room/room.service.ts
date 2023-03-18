import { Injectable } from '@nestjs/common';
import { CreateRoomInput } from './dto/create-room.input';
import { UpdateRoomInput } from './dto/update-room.input';
import { RoomEntity } from './entities/room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '@common/services';

@Injectable()
export class RoomService extends BaseService<
  RoomEntity,
  CreateRoomInput,
  UpdateRoomInput
> {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
  ) {
    super(roomRepository);
  }
}
