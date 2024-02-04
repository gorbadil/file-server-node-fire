import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { increment } from "~/drivers/firebase"

import { <FTName | pascalcase>Collection, <FTName | pascalcase>Counter } from "~/drivers/firebase/collections/<FTName | pascalcase>";

/**
 * Request handler for creating a new {@link <FTName | pascalcase> <FTName | pascalcase>}.
 * @param request The Express request object.
 * @param response The Express response object.
 * @param next The next middleware function.
 *
 * @description Ensure that the request body contains the necessary content to create an {@link <FTName | pascalcase> <FTName | pascalcase>} collection. Use route validations to guarantee this.
 */
export const create: RequestHandler = async (request, response, next) => {
  const body = request.body;
  try {
    const <FTName | camelcase> = await <FTName | pascalcase>Collection().add(body);

    await <FTName | pascalcase>Counter().update({ count: increment(1) });
    const <FTName | camelcase>Data = { id: <FTName | camelcase>.id, ...body };

    response.status(StatusCodes.CREATED).send(<FTName | camelcase>Data);
  } catch (error) {
    next(error);
  }
};

export default create;
