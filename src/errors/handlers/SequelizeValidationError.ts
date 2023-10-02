import { ErrorRequestHandler } from "express"
import { StatusCodes } from "http-status-codes"

/**
 * Error request handler for Sequelize validation errors.
 * @param error - The error object representing the Sequelize validation error.
 * @param _request - The Express request object (not used in this handler).
 * @param response - The Express response object to send the error response.
 * @param next - The Express next function to pass the error to the next error handler.
 */
const SequelizeValidationError: ErrorRequestHandler = async (error, _request, response, next) => {
  if (error.name === "SequelizeValidationError") {
    // If the error is a Sequelize validation error
    return response.status(StatusCodes.NOT_ACCEPTABLE).send(error).json()
  }
  // Pass the error to the next error handler
  next(error)
}

export default SequelizeValidationError
