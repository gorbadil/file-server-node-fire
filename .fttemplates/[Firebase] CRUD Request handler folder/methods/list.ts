import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

import { applyFilters } from "~/drivers/firebase";
import { <FTName | pascalcase>Collection, <FTName | pascalcase>Counter, <FTName | pascalcase>Document } from "~/drivers/firebase/collections/<FTName | pascalcase>";

/**
 * Request handler for retrieving a list of {@link <FTName | pascalcase> <FTName | pascalcase>} entities.
 * @param request The Express request object.
 * @param response The Express response object.
 * @param next The next middleware function.
 *
 * @description Retrieve a list of {@link <FTName | pascalcase> <FTName | pascalcase>} entities from the database based on the provided query parameters,
 *              such as page, pageSize, sortBy and sortType, and send it in the response.
 */
export const list: RequestHandler = async (request, response, next) => {
  const { _sortBy, _sortType, _startAfter, _page, _pageSize, ...query } = request.query;
  const pageSize = Number(_pageSize)
  const page = Number(_page) || 1;
  const offset = page ? (page - 1) * Number(_pageSize) : 0;

  try {
    let <FTName | plural?camelcase> = <FTName | pascalcase>Collection().offset(0);
    applyFilters(<FTName | plural?camelcase>, query);

    const countDoc = await <FTName | pascalcase>Counter().get(); // Toplam döküman sayısını içeren bir sayac dökümanı
    const count = countDoc.exists ? countDoc.data().count : 0;
    const pageCount = Math.ceil(count / pageSize);

    if (_sortBy) {
      <FTName | plural?camelcase> = <FTName | plural?camelcase>.orderBy(String(_sortBy), String(_sortType || "desc") as any);
    }

    if (_startAfter) {
      const startAfterDoc = await <FTName | pascalcase>Document(String(_startAfter)).get();
      <FTName | plural?camelcase> = <FTName | plural?camelcase>.startAfter(startAfterDoc);
    } else if (offset) {
      <FTName | plural?camelcase> = <FTName | plural?camelcase>.offset(offset);
    }

    <FTName | plural?camelcase> = pageSize ? <FTName | plural?camelcase>.limit(Number(pageSize)) : <FTName | plural?camelcase>;

    const result = (await <FTName | plural?camelcase>.get()).docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    response.status(StatusCodes.OK).send({ result, count, page, pageSize, startAfter:_startAfter, pageCount });
  } catch (error) {
    next(error);
  }
};

export default list;
