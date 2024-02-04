import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

import { RequestSchemaType } from "./types";

/**
 * Constructs a request validation middleware based on the provided schema.
 * @param schema - The request schema for validation.
 * @returns The request validation middleware.
 */
export const RequestValidationCtor = (schema: RequestSchemaType): RequestHandler => {
  const handler: RequestHandler = async (request, _response, next) => {
    try {
      if (schema.body) request.body = schema.body.parse(request.body);
      if (schema.query) request.query = schema.query.parse(request.query);
      next();
    } catch (error) {
      next(error);
    }
  };

  return handler;
};
