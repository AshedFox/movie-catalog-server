import { Type } from '@nestjs/common';

export const getPrototypeChain = <T>(classRef: Type<T>) => {
  const baseClass = Object.getPrototypeOf(classRef);
  if (baseClass) {
    return [classRef, ...getPrototypeChain(baseClass)];
  }
  return [classRef];
};
