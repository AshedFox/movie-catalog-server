export const hasName = (value: any): value is { name: string } => {
  return value.name !== undefined && typeof value.name === 'string';
};
