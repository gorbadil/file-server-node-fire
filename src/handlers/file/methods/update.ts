import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { HttpError } from "@ooic/utils";

import { FileDocument } from "~/drivers/firebase/collections/File";
import { FolderDocument } from "~/drivers/firebase/collections/Folder";

/**
 * Request handler for updating an {@link File File} entity.
 * @param request The Express request object.
 * @param response The Express response object.
 * @param next The next middleware function.
 *
 * @description Update an {@link File File} entity in the database based on the provided ID at params and request body,
 *              and send the updated entity in the response.
 */
export const update: RequestHandler = async (request, response, next) => {
  const { id } = request.params;
  const body = request.body;
  try {
    const fileRef = FileDocument(id);
    const file = await fileRef.get();
    
    if (!file.exists) throw new HttpError(StatusCodes.NOT_FOUND);
    
    await fileRef.update(body);
    const fileData = { id: file.id, ...file.data(), ...body };

    response.status(StatusCodes.OK).send(fileData);
  } catch (error) {
    next(error);
  }
};

export default update;
