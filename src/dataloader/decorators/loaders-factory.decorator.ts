import { Context } from '@nestjs/graphql';

export const LoadersFactory = (): ParameterDecorator => {
  return (
    target: NonNullable<unknown>,
    propertyKey: string | symbol,
    parameterIndex: number,
  ) => {
    return Context('loadersFactory')(target, propertyKey, parameterIndex);
  };
};
