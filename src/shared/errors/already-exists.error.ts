export class AlreadyExistsError extends Error {
  constructor(msg?: string) {
    super(msg);
    this.name = AlreadyExistsError.name;
  }
}
