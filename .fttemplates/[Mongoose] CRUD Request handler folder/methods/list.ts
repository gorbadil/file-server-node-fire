import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

import { <FTName | pascalcase> } from "~/drivers/mongoose/collections/<FTName | pascalcase>";

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
  const { _sortBy, _sortType, _page, _pageSize, ...query } = request.query;
  const page = Number(_page) || 1;
  const pageSize = Number(_pageSize)
  const offset = ((page - 1) * Number(_pageSize)) || 0;
  try {
    const count = await <FTName | pascalcase>.countDocuments(query);
    const pageCount = Math.ceil(count/pageSize)
    let <FTName | plural?camelcase> = <FTName | pascalcase>
    
    <FTName | plural?camelcase> = _sortBy ? <FTName | plural?camelcase>.sort({[String(_sortBy)]: _sortType === "desc" ? -1 : 1}) : <FTName | plural?camelcase>;
    <FTName | plural?camelcase> = offset ? <FTName | plural?camelcase>.skip(offset) : <FTName | plural?camelcase>;
    <FTName | plural?camelcase> = pageSize ? <FTName | plural?camelcase>.limit(Number(pageSize)) : <FTName | plural?camelcase>
    const result = await <FTName | plural?camelcase>
    
    response.status(StatusCodes.OK).send({ result, count, page, pageSize, pageCount });
  } catch (error) {
    next(error);
  }
};

export default list;
