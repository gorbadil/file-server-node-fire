import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { HttpError } from "@ooic/utils";

import { FileDocument } from "~/drivers/firebase/collections/File";

/**
 * Request handler for retrieving an {@link File File} by its ID.
 * @param request The Express request object.
 * @param response The Express response object.
 * @param next The next middleware function.
 *
 * @description Retrieve the {@link File File} from the database based on the provided ID and send it in the response.
 */
export const findById: RequestHandler = async (request, response, next) => {
  const { id } = request.params;
  try {
    const file = await FileDocument(id).get();

    if (!file.exists) throw new HttpError(StatusCodes.NOT_FOUND);

    const fileData = { id: file.id, ...file.data() };

    response.status(StatusCodes.OK).send(fileData);
  } catch (error) {
    next(error);
  }
};

export default findById;
