export class ApiError extends Error {
  public statusCode: number;
  public error?: any;

  constructor(statusCode: number, message: string, error?: any) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
