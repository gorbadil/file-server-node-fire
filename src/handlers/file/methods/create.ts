import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { increment } from "~/drivers/firebase";

import { FileCollection, FileCounter } from "~/drivers/firebase/collections/File";
import { FolderDocument } from "~/drivers/firebase/collections/Folder";

/**
 * Request handler for creating a new {@link File File}.
 * @param request The Express request object.
 * @param response The Express response object.
 * @param next The next middleware function.
 *
 * @description Ensure that the request body contains the necessary content to create an {@link File File} collection. Use route validations to guarantee this.
 */
export const create: RequestHandler = async (request, response, next) => {
  const body = request.body;
  try {
    const file = await FileCollection().add(body);

    await FileCounter().update({ count: increment(1) });

    const fileData = { id: file.id, ...body };

    response.status(StatusCodes.CREATED).send(fileData);
  } catch (error) {
    next(error);
  }
};

export default create;
