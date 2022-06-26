import { registerEnumType } from '@nestjs/graphql';

export enum PersonTypeEnum {
  Actor = 'ACTOR',
  Director = 'DIRECTOR',
  Editor = 'EDITOR',
  Artist = 'ARTIST',
}

registerEnumType(PersonTypeEnum, {
  name: 'PersonTypeEnum',
  description: 'Person types (like actor, director, etc)',
});
