import { getReasonPhrase } from "http-status-codes";
/**
 * Represents an HTTP error with a specific status code.
 *
 * This class extends the built-in Error class to include an associated HTTP status code.
 */
class HttpError extends Error {
  /**
   * Creates a new instance of HttpError.
   * @param code - The HTTP status code for the error.
   * @param message - The error message.
   * @param name - The name of the error (default: "HttpError").
   */
  constructor(public readonly code: number, message?: string, public name: string = "HttpError") {
    super(message || getReasonPhrase(code));
  }
}

export default HttpError;
