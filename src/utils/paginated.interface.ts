export interface IPaginated<T> {
  data: T[];
  count: number;
  hasNext: boolean;
}
