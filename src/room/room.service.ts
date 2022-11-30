import { Injectable } from '@nestjs/common';
import { CreateRoomInput } from './dto/create-room.input';
import { UpdateRoomInput } from './dto/update-room.input';
import { RoomEntity } from './entities/room.entity';
import { PaginatedRooms } from './dto/paginated-rooms';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { NotFoundError } from '@utils/errors';
import { GqlOffsetPagination } from '@common/pagination';
import { SortType } from '@common/sort';
import { FilterType } from '@common/filter';
import { parseArgsToQuery } from '@common/typeorm-query-parser';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
  ) {}

  create = async (createRoomInput: CreateRoomInput): Promise<RoomEntity> => {
    return this.roomRepository.save(createRoomInput);
  };

  readMany = async (
    pagination?: GqlOffsetPagination,
    sort?: SortType<RoomEntity>,
    filter?: FilterType<RoomEntity>,
  ): Promise<PaginatedRooms> => {
    const qb = parseArgsToQuery(this.roomRepository, pagination, sort, filter);
    const { entities: data } = await qb.getRawAndEntities();
    const count = await qb.getCount();

    return {
      edges: data,
      totalCount: count,
      hasNext: count > pagination.take + pagination.skip,
    };
  };

  readManyByIds = async (ids: string[]): Promise<RoomEntity[]> =>
    await this.roomRepository.findBy({ id: In(ids) });

  readOne = async (id: string): Promise<RoomEntity> => {
    const room = await this.roomRepository.findOneBy({ id });
    if (!room) {
      throw new NotFoundError(`Room with id "${id}" not found!`);
    }
    return room;
  };

  update = async (
    id: string,
    updateRoomInput: UpdateRoomInput,
  ): Promise<RoomEntity> => {
    const room = await this.roomRepository.findOneBy({ id });
    if (!room) {
      throw new NotFoundError(`Room with id "${id}" not found!`);
    }
    return this.roomRepository.save({
      ...room,
      ...updateRoomInput,
    });
  };

  delete = async (id: string): Promise<boolean> => {
    const room = await this.roomRepository.findOneBy({ id });
    if (!room) {
      throw new NotFoundError(`Room with id "${id}" not found!`);
    }
    await this.roomRepository.remove(room);
    return true;
  };
}
