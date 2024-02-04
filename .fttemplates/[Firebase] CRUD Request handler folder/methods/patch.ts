import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { HttpError } from "@ooic/utils";

import { <FTName | pascalcase>Document } from "~/drivers/firebase/collections/<FTName | pascalcase>";

/**
 * Request handler for patching an {@link <FTName | pascalcase> <FTName | pascalcase>} entity.
 * @param request The Express request object.
 * @param response The Express response object.
 * @param next The next middleware function.
 *
 * @description Patch an {@link <FTName | pascalcase> <FTName | pascalcase>} entity in the database based on the provided ID at params and request body,
 *              and send the updated entity in the response.
 */
export const patch: RequestHandler = async (request, response, next) => {
  const { id } = request.params;
  const body = request.body;
  try {
    const <FTName | camelcase>Ref = <FTName | pascalcase>Document(id);
    const <FTName | camelcase> = await <FTName | camelcase>Ref.get();

    if (!<FTName | camelcase>.exists) throw new HttpError(StatusCodes.NOT_FOUND);

    await <FTName | camelcase>Ref.update(body);
    const <FTName | camelcase>Data = { id: <FTName | camelcase>.id, ...<FTName | camelcase>.data(), ...body };

    response.status(StatusCodes.OK).send(<FTName | camelcase>Data);
  } catch (error) {
    next(error);
  }
};

export default patch;
