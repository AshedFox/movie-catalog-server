import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateRoomInput } from './dto/create-room.input';
import { UpdateRoomInput } from './dto/update-room.input';
import { RoomEntity } from './entities/room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '@common/services';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RoomParticipantService } from '../room-participant/room-participant.service';

@Injectable()
export class RoomService extends BaseService<
  RoomEntity,
  CreateRoomInput,
  UpdateRoomInput
> {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => RoomParticipantService))
    private readonly roomParticipantService: RoomParticipantService,
  ) {
    super(roomRepository);
  }

  makeInviteToken = (room: RoomEntity): string => {
    return this.jwtService.sign(
      {
        sub: room.id,
      },
      {
        algorithm: 'HS512',
        secret: this.configService.get<string>('ROOM_INVITE_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('ROOM_INVITE_TOKEN_LIFETIME'),
      },
    );
  };

  joinWithInvite = async (inviteToken: string, userId: string) => {
    try {
      const { sub } = this.jwtService.verify<{
        sub: string;
      }>(inviteToken, {
        algorithms: ['HS512'],
        secret: this.configService.get<string>('ROOM_INVITE_TOKEN_SECRET'),
      });

      await this.roomParticipantService.create(sub, userId);
      return true;
    } catch (err) {
      throw new BadRequestException(err);
    }
  };
}
