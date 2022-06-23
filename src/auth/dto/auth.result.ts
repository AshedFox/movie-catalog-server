import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthResult {
  @Field()
  accessToken!: string;

  @Field()
  refreshToken!: string;
}
