import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

import { applyFilters } from "~/drivers/firebase";
import { FolderCollection, FolderCounter, FolderDocument } from "~/drivers/firebase/collections/Folder";

/**
 * Request handler for retrieving a list of {@link Folder Folder} entities.
 * @param request The Express request object.
 * @param response The Express response object.
 * @param next The next middleware function.
 *
 * @description Retrieve a list of {@link Folder Folder} entities from the database based on the provided query parameters,
 *              such as page, pageSize, sortBy and sortType, and send it in the response.
 */
export const list: RequestHandler = async (request, response, next) => {
  const { _sortBy, _sortType, _startAfter, _page, _pageSize, ...query } = request.query;
  const pageSize = Number(_pageSize)
  const page = Number(_page) || 1;
  const offset = page ? (page - 1) * Number(_pageSize) : 0;

  try {
    let folders = FolderCollection().offset(0);
    applyFilters(folders, query);

    const countDoc = await FolderCounter().get(); // Toplam döküman sayısını içeren bir sayac dökümanı
    const count = countDoc.exists ? countDoc.data().count : 0;
    const pageCount = Math.ceil(count / pageSize);

    if (_sortBy) {
      folders = folders.orderBy(String(_sortBy), String(_sortType || "desc") as any);
    }

    if (_startAfter) {
      const startAfterDoc = await FolderDocument(String(_startAfter)).get();
      folders = folders.startAfter(startAfterDoc);
    } else if (offset) {
      folders = folders.offset(offset);
    }

    folders = pageSize ? folders.limit(Number(pageSize)) : folders;

    const result = (await folders.get()).docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    response.status(StatusCodes.OK).send({ result, count, page, pageSize, startAfter:_startAfter, pageCount });
  } catch (error) {
    next(error);
  }
};

export default list;
