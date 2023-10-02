import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

import { <FTName | pascalcase> } from "~/drivers/mongoose/models/<FTName | pascalcase>";

/**
 * Request handler for retrieving an {@link <FTName | pascalcase> <FTName | pascalcase>} by its ID.
 * @param request The Express request object.
 * @param response The Express response object.
 * @param next The next middleware function.
 *
 * @description Retrieve the {@link <FTName | pascalcase> <FTName | pascalcase>} from the database based on the provided ID and send it in the response.
 */
export const findById: RequestHandler = async (request, response, next) => {
  const { id } = request.params;
  try {
    const <FTName | camelcase> = await <FTName | pascalcase>.findByPk(id);
    response.status(StatusCodes.OK).send(<FTName | camelcase>);
  } catch (error) {
    next(error);
  }
};

export default findById;
