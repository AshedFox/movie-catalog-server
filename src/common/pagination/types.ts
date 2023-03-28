import { OffsetPaginationArgs, OffsetPaginationArgsType } from './offset';
import { RelayPaginationArgs, RelayPaginationArgsType } from './relay';

export type InferPaginationType<P extends PaginationVariant> =
  P extends 'take-skip'
    ? OffsetPaginationArgs
    : P extends 'relay'
    ? RelayPaginationArgs
    : never;

export type PaginationVariant = 'take-skip' | 'relay';

export type PaginationArgsType =
  | OffsetPaginationArgsType
  | RelayPaginationArgsType;
