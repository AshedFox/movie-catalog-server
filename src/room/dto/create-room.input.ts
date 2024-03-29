import { Field, HideField, InputType } from '@nestjs/graphql';
import { RoomEntity } from '../entities/room.entity';
import { Length } from 'class-validator';

@InputType()
export class CreateRoomInput implements Partial<RoomEntity> {
  @Field()
  @Length(3, 255)
  name: string;

  @HideField()
  ownerId: string;
}
