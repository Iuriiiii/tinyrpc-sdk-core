export class HttpError extends Error {
  constructor(public readonly errorCode: number, message?: string | object) {
    super(message instanceof Object ? JSON.stringify(message) : message);
  }
}
