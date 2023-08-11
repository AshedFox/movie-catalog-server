export class AuthError extends Error {
  constructor(msg?: string) {
    super(msg);
    this.name = AuthError.name;
  }
}
