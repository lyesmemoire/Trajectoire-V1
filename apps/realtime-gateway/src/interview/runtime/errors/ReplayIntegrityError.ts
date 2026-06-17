export class ReplayIntegrityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReplayIntegrityError";
  }
}
