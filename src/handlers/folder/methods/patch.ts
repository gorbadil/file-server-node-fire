import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { HttpError } from "@ooic/utils";

import { FolderDocument } from "~/drivers/firebase/collections/Folder";

/**
 * Request handler for patching an {@link Folder Folder} entity.
 * @param request The Express request object.
 * @param response The Express response object.
 * @param next The next middleware function.
 *
 * @description Patch an {@link Folder Folder} entity in the database based on the provided ID at params and request body,
 *              and send the updated entity in the response.
 */
export const patch: RequestHandler = async (request, response, next) => {
  const { id } = request.params;
  const body = request.body;
  try {
    const folderRef = FolderDocument(id);
    const folder = await folderRef.get();

    if (!folder.exists) throw new HttpError(StatusCodes.NOT_FOUND);
    
    await folderRef.update(body);
    const folderData = { id: folder.id, ...folder.data(), ...body };

    response.status(StatusCodes.OK).send(folderData);
  } catch (error) {
    next(error);
  }
};

export default patch;
