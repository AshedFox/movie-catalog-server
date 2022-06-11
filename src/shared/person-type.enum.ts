import { registerEnumType } from '@nestjs/graphql';

export enum PersonTypeEnum {
  Actor = 'ACTOR',
  Director = 'DIRECTOR',
}

registerEnumType(PersonTypeEnum, {
  name: 'PersonTypeEnum',
  description: 'Person types (like actor, director, etc)',
});
