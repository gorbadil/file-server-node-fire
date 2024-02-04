import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { HttpError } from "@ooic/utils";

import { <FTName | pascalcase>Document } from "~/drivers/firebase/collections/<FTName | pascalcase>";

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
    const <FTName | camelcase> = await <FTName | pascalcase>Document(id).get();

    if (!<FTName | camelcase>.exists) throw new HttpError(StatusCodes.NOT_FOUND);

    const <FTName | camelcase>Data = { id: <FTName | camelcase>.id, ...<FTName | camelcase>.data() };

    response.status(StatusCodes.OK).send(<FTName | camelcase>Data);
  } catch (error) {
    next(error);
  }
};

export default findById;
