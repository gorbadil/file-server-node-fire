import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { HttpError } from "@ooic/utils";

import { FolderDocument } from "~/drivers/firebase/collections/Folder";

/**
 * Request handler for retrieving an {@link Folder Folder} by its ID.
 * @param request The Express request object.
 * @param response The Express response object.
 * @param next The next middleware function.
 *
 * @description Retrieve the {@link Folder Folder} from the database based on the provided ID and send it in the response.
 */
export const findById: RequestHandler = async (request, response, next) => {
  const { id } = request.params;
  try {
    const folder = await FolderDocument(id).get();

    if (!folder.exists) throw new HttpError(StatusCodes.NOT_FOUND);

    const folderData = { id: folder.id, ...folder.data() };

    response.status(StatusCodes.OK).send(folderData);
  } catch (error) {
    next(error);
  }
};

export default findById;
