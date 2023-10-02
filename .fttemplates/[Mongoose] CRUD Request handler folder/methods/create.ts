import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

import { <FTName | pascalcase> } from "~/drivers/mongoose/models/<FTName | pascalcase>";

/**
 * Request handler for creating a new {@link <FTName | pascalcase> <FTName | pascalcase>}.
 * @param request The Express request object.
 * @param response The Express response object.
 * @param next The next middleware function.
 *
 * @description Ensure that the request body contains the necessary content to create an {@link <FTName | pascalcase> <FTName | pascalcase>} model. Use route validations to guarantee this.
 */
export const create: RequestHandler = async (request, response, next) => {
  const body = request.body;
  try {
    const <FTName | camelcase> = new <FTName | pascalcase>(body);
    const new<FTName | pascalcase> = await <FTName | camelcase>.save()
    response.status(StatusCodes.CREATED).send(new<FTName | pascalcase>);
  } catch (error) {
    next(error);
  }
};

export default create;
