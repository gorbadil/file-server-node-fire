import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

import { <FTName | pascalcase> } from "~/drivers/sequelize/models/<FTName | pascalcase>";

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
  const pageSize = Number(_pageSize) || 16
  const offset = ((page - 1) * Number(_pageSize)) || 0;
  try {
    const <FTName | plural?camelcase> = await <FTName | pascalcase>.findAndCountAll({
      offset,
      limit:pageSize,
      where: query,
      ...(_sortBy ? { order: [[_sortBy as string, (_sortType as "asc" | "desc") || "asc"]] } : {}),
    });
    const count = <FTName | plural?camelcase>.count
    const pageCount = Math.ceil(count/pageSize)
    const result = <FTName | plural?camelcase>.rows
    
    response.status(StatusCodes.OK).send({result, count, page, pageSize, pageCount});
  } catch (error) {
    next(error);
  }
};

export default list;
