import { registerEnumType } from '@nestjs/graphql';

export enum AgeRestrictionEnum {
  G = 'G',
  PG = 'PG',
  PG13 = 'PG-13',
  R = 'R',
  NC17 = 'NC-17',
}

registerEnumType(AgeRestrictionEnum, {
  name: 'AgeRestrictionEnum',
  description: 'Movies age restrictions in MPAA system',
});
