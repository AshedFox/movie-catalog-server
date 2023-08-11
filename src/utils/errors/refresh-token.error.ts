export class RefreshTokenError extends Error {
  constructor(msg?: string) {
    super(msg);
    this.name = RefreshTokenError.name;
  }
}
