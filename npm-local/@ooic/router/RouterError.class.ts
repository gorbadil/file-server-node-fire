export class RouterError extends Error {
  constructor(public readonly code: number, message: string, public name: string = "RouterError") {
    super(message);
  }
  toString() {
    return this.message;
  }
}
