/**
 * Represents an HTTP error with a specific status code.
 *
 * This class extends the built-in Error class to include an associated HTTP status code.
 */
class HttpError extends Error {
  /**
   * The HTTP status code associated with the error.
   */
  public readonly statusCode: number;

  /**
   * Creates a new instance of HttpError.
   * @param code - The HTTP status code for the error.
   * @param message - The error message.
   * @param name - The name of the error (default: "HttpError").
   */
  constructor(code: number, message: string, name: string = "HttpError") {
    super(message);
    this.name = name;
    this.statusCode = code;
  }
}

export default HttpError;
