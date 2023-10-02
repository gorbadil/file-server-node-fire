import { ErrorRequestHandler } from "express"
import { StatusCodes } from "http-status-codes"

/**
 * Error request handler for Zod errors.
 * @param error - The error object representing the Zod error.
 * @param _request - The Express request object (not used in this handler).
 * @param response - The Express response object to send the error response.
 * @param next - The Express next function to pass the error to the next error handler.
 */
const ZodError: ErrorRequestHandler = async (error, _request, response, next) => {
  if (error.name === "ZodError" ) {
    // If the error is a Zod error
    return response.status(StatusCodes.BAD_REQUEST).send(error).json()
  }
  // Pass the error to the next error handler
  next(error)
}

export default ZodError
