import { ErrorRequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * Defines an Express error handling middleware.
 *
 * This middleware handles errors and sends an appropriate response based on the error type.
 * If the error's name is "NotFoundError", it sends the error object as the response body with a 500 status code.
 * Otherwise, it passes the error to the next middleware.
 *
 * @param error - The error object.
 * @param _request - The Express request object (unused).
 * @param response - The Express response object.
 * @param next - The next middleware function.
 */
const NotFoundError: ErrorRequestHandler = async (error, _request, response, next) => {
  if (error.name === "NotFoundError") return response.status(StatusCodes.NOT_FOUND).send(error).json();
  next(error);
};

export default NotFoundError;
