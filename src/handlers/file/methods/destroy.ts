import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { HttpError } from "@ooic/utils";
import { decrement } from "~/drivers/firebase"

import { FileDocument, FileCounter } from "~/drivers/firebase/collections/File";

/**
 * Request handler for destroying an {@link File File}.
 * @param request The Express request object.
 * @param response The Express response object.
 * @param next The next middleware function.
 *
 * @description Ensure that the request parameter "id" corresponds to an existing {@link File File} and delete it from the database.
 */
export const destroy: RequestHandler = async (request, response, next) => {
  const { id } = request.params;
  try {
    const fileRef = FileDocument(id);
    const file = await fileRef.get();

    if (!file.exists) throw new HttpError(StatusCodes.NOT_FOUND);

    const fileData = { id: file.id, ...file.data() };
    await fileRef.delete();
    await FileCounter().update({ count: decrement(1) });

    response.status(StatusCodes.OK).send(fileData);
  } catch (error) {
    next(error);
  }
};

export default destroy;
