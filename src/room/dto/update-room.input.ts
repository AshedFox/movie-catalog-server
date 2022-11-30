import { CreateRoomInput } from './create-room.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRoomInput extends PartialType(CreateRoomInput) {}
