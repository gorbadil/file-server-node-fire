import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { increment } from "~/drivers/firebase";

import { FolderCollection, FolderCounter, FolderDocument } from "~/drivers/firebase/collections/Folder";

/**
 * Request handler for creating a new {@link Folder Folder}.
 * @param request The Express request object.
 * @param response The Express response object.
 * @param next The next middleware function.
 *
 * @description Ensure that the request body contains the necessary content to create an {@link Folder Folder} collection. Use route validations to guarantee this.
 */
export const create: RequestHandler = async (request, response, next) => {
  const body = request.body;
  try {
    const folder = await FolderCollection().add(body);

    await FolderCounter().update({ count: increment(1) });

    const folderData = { id: folder.id, ...body, parentId: body.parentId || null };

    response.status(StatusCodes.CREATED).send(folderData);
  } catch (error) {
    next(error);
  }
};

export default create;
