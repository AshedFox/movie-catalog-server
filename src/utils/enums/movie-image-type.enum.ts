import { registerEnumType } from '@nestjs/graphql';

export enum MovieImageTypeEnum {
  POSTER = 'POSTER',
  FRAME = 'FRAME',
  PROMO = 'PROMO',
  OTHER = 'OTHER',
}

registerEnumType(MovieImageTypeEnum, {
  name: 'MovieImageTypeEnum',
});
