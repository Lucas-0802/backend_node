export class AppError extends Error {
  public readonly code: string;
  public readonly message: string;
  public readonly statusCode: number;

  constructor(code: string, message: string, statusCode = 500) {
    super(message);
    this.code = code;
    this.message = message;
    this.statusCode = statusCode;
  }
}
