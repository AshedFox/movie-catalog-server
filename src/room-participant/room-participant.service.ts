import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AlreadyExistsError, NotFoundError } from '@utils/errors';
import { RoomParticipantEntity } from './entities/room-participant.entity';
import { RoomService } from '../room/room.service';
import { UserService } from '../user/user.service';
import { WrapperType } from '@utils/types';

@Injectable()
export class RoomParticipantService {
  constructor(
    @InjectRepository(RoomParticipantEntity)
    private readonly roomParticipantRepository: Repository<RoomParticipantEntity>,
    @Inject(forwardRef(() => RoomService))
    private readonly roomService: WrapperType<RoomService>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: WrapperType<UserService>,
  ) {}

  create = async (
    roomId: string,
    userId: string,
  ): Promise<RoomParticipantEntity> => {
    await this.roomService.readOne(roomId);
    await this.userService.readOneById(userId);
    const roomParticipant = await this.roomParticipantRepository.findOneBy({
      roomId,
      userId,
    });
    if (roomParticipant) {
      throw new AlreadyExistsError(
        `Room participant with roomId "${roomId}" and userId "${userId}" already exists!`,
      );
    }
    return this.roomParticipantRepository.save({ roomId, userId });
  };

  createManyForRoom = async (
    roomId: string,
    usersIds: string[],
  ): Promise<RoomParticipantEntity[]> =>
    this.roomParticipantRepository.save(
      usersIds.map((userId) => ({ roomId, userId })),
    );

  readMany = async (): Promise<RoomParticipantEntity[]> =>
    this.roomParticipantRepository.find();

  readManyByRooms = async (
    roomsIds: string[],
  ): Promise<RoomParticipantEntity[]> =>
    this.roomParticipantRepository.find({
      where: { roomId: In(roomsIds) },
      relations: {
        user: true,
      },
    });

  readOne = async (
    roomId: string,
    userId: string,
  ): Promise<RoomParticipantEntity> => {
    const roomParticipant = await this.roomParticipantRepository.findOneBy({
      roomId,
      userId,
    });
    if (!roomParticipant) {
      throw new NotFoundError(
        `Room participant with roomId "${roomId}" and userId "${userId}" not found!`,
      );
    }
    return roomParticipant;
  };

  delete = async (
    roomId: string,
    userId: string,
  ): Promise<RoomParticipantEntity> => {
    const roomParticipant = await this.roomParticipantRepository.findOneBy({
      roomId,
      userId,
    });
    if (!roomParticipant) {
      throw new NotFoundError(
        `Room participant with roomId "${roomId}" and userId "${userId}" not found!`,
      );
    }
    const removed = await this.roomParticipantRepository.remove(
      roomParticipant,
    );
    return {
      ...removed,
      roomId,
      userId,
    };
  };
}
