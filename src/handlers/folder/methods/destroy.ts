import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { HttpError } from "@ooic/utils";
import { decrement } from "~/drivers/firebase";

import { FolderDocument, FolderCounter } from "~/drivers/firebase/collections/Folder";

/**
 * Request handler for destroying an {@link Folder Folder}.
 * @param request The Express request object.
 * @param response The Express response object.
 * @param next The next middleware function.
 *
 * @description Ensure that the request parameter "id" corresponds to an existing {@link Folder Folder} and delete it from the database.
 */
export const destroy: RequestHandler = async (request, response, next) => {
  const { id } = request.params;
  try {
    const folderRef = FolderDocument(id);
    const folder = await folderRef.get();

    if (!folder.exists) throw new HttpError(StatusCodes.NOT_FOUND);

    const folderData = { id: folder.id, ...folder.data() };
    await folderRef.delete();
    await FolderCounter().update({ count: decrement(1) });

    response.status(StatusCodes.OK).send(folderData);
  } catch (error) {
    next(error);
  }
};

export default destroy;
