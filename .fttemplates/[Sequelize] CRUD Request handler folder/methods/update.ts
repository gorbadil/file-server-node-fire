import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

import { <FTName | pascalcase>import { HandlerWithResponse, ResponseWithStatusCode } from "@ooic/router/types";
 } from "~/drivers/sequelize/models/<FTName | pascalcase>";

/**
 * Request handler for updating an {@link <FTName | pascalcase> <FTName | pascalcase>} entity.
 * @param request The Express request object.
 * @param response The Express response object.
 * @param next The next middleware function.
 *
 * @description Update an {@link <FTName | pascalcase> <FTName | pascalcase>} entity in the database based on the provided ID at params and request body,
 *              and send the updated entity in the response.
 */
export const update: RequestHandler = async (request, response, next) => {
  const { id } = request.params;
  const body = request.body;
  try {
    const <FTName | camelcase> = await  <FTName | pascalcase>.findByPk(id);

    if (!<FTName | camelcase>) throw new HttpError(StatusCodes.NOT_FOUND);

    await <FTName | camelcase>.update(body);
    response.status(StatusCodes.OK).send(<FTName | camelcase>);
  } catch (error) {
    next(error);
  }
};

export default update;