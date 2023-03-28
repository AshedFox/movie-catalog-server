import { Injectable } from '@nestjs/common';
import { CreateRoomVideoInput } from './dto/create-room-video.input';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomVideoEntity } from './entities/room-video.entity';
import {
  And,
  In,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { AlreadyExistsError, NotFoundError } from '@utils/errors';
import { RoomService } from '../room/room.service';
import { VideoService } from '../video/video.service';
import { OffsetPaginationArgsType } from '@common/pagination/offset';
import { SortType } from '@common/sort';
import { FilterType } from '@common/filter';
import { parseArgsToQuery } from '@common/typeorm-query-parser';
import { MoveRoomVideoInput } from './dto/move-room-video.input';

@Injectable()
export class RoomVideoService {
  constructor(
    @InjectRepository(RoomVideoEntity)
    private readonly roomVideoRepository: Repository<RoomVideoEntity>,
    private readonly roomService: RoomService,
    private readonly videoService: VideoService,
  ) {}

  count = async (filter?: FilterType<RoomVideoEntity>): Promise<number> => {
    return parseArgsToQuery(
      this.roomVideoRepository,
      undefined,
      undefined,
      filter,
    ).getCount();
  };

  create = async (input: CreateRoomVideoInput) => {
    const { roomId, videoId } = input;

    await this.roomService.readOne(roomId);
    await this.videoService.readOne(videoId);

    const roomVideo = await this.roomVideoRepository.findOneBy({
      roomId,
      videoId,
    });
    if (roomVideo) {
      throw new AlreadyExistsError(
        `Room video with roomId "${roomId}" and videoId "${videoId}" already exists!`,
      );
    }

    const lastRoomVideoOrder = await this.roomVideoRepository.maximum('order', {
      roomId,
    });

    return this.roomVideoRepository.save({
      ...input,
      order: lastRoomVideoOrder ?? 1,
    });
  };

  readMany = async (
    pagination?: OffsetPaginationArgsType,
    sort?: SortType<RoomVideoEntity>,
    filter?: FilterType<RoomVideoEntity>,
  ): Promise<RoomVideoEntity[]> => {
    return parseArgsToQuery(
      this.roomVideoRepository,
      pagination,
      sort,
      filter,
    ).getMany();
  };

  readManyByRooms = async (roomsIds: string[]): Promise<RoomVideoEntity[]> =>
    this.roomVideoRepository.find({
      where: { roomId: In(roomsIds) },
      relations: {
        video: true,
      },
    });

  readOne = async (
    roomId: string,
    videoId: number,
  ): Promise<RoomVideoEntity> => {
    const roomVideo = await this.roomVideoRepository.findOneBy({
      roomId,
      videoId,
    });
    if (!roomVideo) {
      throw new NotFoundError(
        `Room video with roomId "${roomId}" and videoId "${videoId}" not found!`,
      );
    }
    return roomVideo;
  };

  move = async (
    roomId: string,
    input: MoveRoomVideoInput,
  ): Promise<RoomVideoEntity> => {
    const { oldOrder, newOrder } = input;

    if (oldOrder === newOrder) {
      throw new Error('Old and new order are equal');
    }

    const oldOrderRoomVideo = await this.roomVideoRepository.findOneBy({
      roomId,
      order: oldOrder,
    });
    if (!oldOrderRoomVideo) {
      throw new NotFoundError(
        `Room video with roomId "${roomId}" and order "${oldOrder}" not found!`,
      );
    }

    const newOrderRoomVideo = await this.roomVideoRepository.findOneBy({
      roomId,
      order: newOrder,
    });
    if (!newOrderRoomVideo) {
      throw new NotFoundError(
        `Room video with roomId "${roomId}" and order "${newOrder}" not found!`,
      );
    }

    const result = await this.roomVideoRepository.save({
      ...oldOrderRoomVideo,
      order: newOrder,
    });

    if (newOrder > oldOrder) {
      await this.roomVideoRepository.decrement(
        {
          roomId,
          order: And(MoreThan(oldOrder), LessThanOrEqual(newOrder)),
        },
        'order',
        1,
      );
    } else {
      await this.roomVideoRepository.increment(
        {
          roomId,
          order: And(MoreThanOrEqual(newOrder), LessThan(oldOrder)),
        },
        'order',
        1,
      );
    }

    return result;
  };

  delete = async (
    roomId: string,
    videoId: number,
  ): Promise<RoomVideoEntity> => {
    const roomVideo = await this.roomVideoRepository.findOneBy({
      roomId,
      videoId,
    });
    if (!roomVideo) {
      throw new NotFoundError(
        `Room video with roomId "${roomId}" and videoId "${videoId}" not found!`,
      );
    }
    const removed = await this.roomVideoRepository.remove(roomVideo);

    await this.roomVideoRepository.decrement(
      {
        roomId,
        order: MoreThan(removed.order),
      },
      'order',
      1,
    );

    return removed;
  };
}
