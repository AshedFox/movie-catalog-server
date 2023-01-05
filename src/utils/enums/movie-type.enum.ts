import { registerEnumType } from '@nestjs/graphql';

export enum MovieTypeEnum {
  Film = 'film',
  Series = 'series',
}

registerEnumType(MovieTypeEnum, {
  name: 'MovieTypeEnum',
});
