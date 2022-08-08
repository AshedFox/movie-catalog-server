import { registerEnumType } from '@nestjs/graphql';

export enum MoviePersonTypeEnum {
  ACTOR = 'ACTOR',
  COMPOSER = 'COMPOSER',
  DESIGNER = 'DESIGNER',
  DIRECTOR = 'DIRECTOR',
  EDITOR = 'EDITOR',
  OPERATOR = 'OPERATOR',
  PRODUCER = 'PRODUCER',
  WRITER = 'WRITER',
}

registerEnumType(MoviePersonTypeEnum, {
  name: 'PersonTypeEnum',
  description: 'Person types (like actor, director, etc)',
});
