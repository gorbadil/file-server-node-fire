import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { HttpError } from "@ooic/utils";
import { decrement } from "~/drivers/firebase"

import { <FTName | pascalcase>Document, <FTName | pascalcase>Counter } from "~/drivers/firebase/collections/<FTName | pascalcase>";

/**
 * Request handler for destroying an {@link <FTName | pascalcase> <FTName | pascalcase>}.
 * @param request The Express request object.
 * @param response The Express response object.
 * @param next The next middleware function.
 *
 * @description Ensure that the request parameter "id" corresponds to an existing {@link <FTName | pascalcase> <FTName | pascalcase>} and delete it from the database.
 */
export const destroy: RequestHandler = async (request, response, next) => {
  const { id } = request.params;
  try {
    const <FTName | camelcase>Ref = <FTName | pascalcase>Document(id);
    const <FTName | camelcase> = await <FTName | camelcase>Ref.get();

    if (!<FTName | camelcase>.exists) throw new HttpError(StatusCodes.NOT_FOUND);

    const <FTName | camelcase>Data = { id: <FTName | camelcase>.id, ...<FTName | camelcase>.data() };
    await <FTName | camelcase>Ref.delete();
    await <FTName | pascalcase>Counter().update({ count: decrement(1) });

    response.status(StatusCodes.OK).send(<FTName | camelcase>Data);
  } catch (error) {
    next(error);
  }
};

export default destroy;
