import { Field, ObjectType } from '@nestjs/graphql';
import { UserEntity } from '../../user/entities/user.entity';

@ObjectType()
export class AuthResult {
  @Field(() => UserEntity)
  user: UserEntity;

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
