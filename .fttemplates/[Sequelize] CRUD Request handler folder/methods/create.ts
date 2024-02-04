import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { WithId } from "~/router/___util"
import { <FTName | pascalcase> } from "~/drivers/sequelize/models/<FTName | pascalcase>";
  
import { HandlerWithResponse, ResponseWithStatusCode } from "@ooic/router/types";
import zodToJsonSchema from "zod-to-json-schema";
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
    const <FTName | camelcase> = await <FTName | pascalcase>.create(body);
    response.status(StatusCodes.CREATED).send(<FTName | camelcase>);
  } catch (error) {
    next(error);
  }
};

export default create;