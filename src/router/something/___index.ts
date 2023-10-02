import { Endpoint } from "@ooic/router";
import { StatusCodes } from "http-status-codes";
import zodToJsonSchema from "zod-to-json-schema";

import { StdQuery, WithId, AsList } from "~/router/___util";

import { SomethingSchema } from "./___schema";

const router = new Endpoint(/* handlers.auth.verifyToken */);

/**
 * Route for creating a new something.
 * @name Create Something
 * @route POST /something
 * @returns {Something} The created something.
 */
router
  .post({ body: SomethingSchema })
  .handler(() => {}, {
    code: StatusCodes.CREATED,
    description: "successfully created",
    schema: zodToJsonSchema(WithId(SomethingSchema)),
  })
  .tags("something")
  .summary("Create a new something")
  .description("Route for creating a new something, returns the created something");

/**
 * Route for listing Somethings.
 * @name List Somethings
 * @route GET /something
 * @param {string} _sortBy - The field to sort the Somethings by.
 * @param {string} _sortType - The sort type ('asc' or 'desc').
 * @param {string} _page - The sort type ('asc' or 'desc').
 * @param {string} _pageSize - The sort type ('asc' or 'desc').
 * @returns {count: number,result:Something[], page: number, pageSize: number, pageCount: number } The list of Somethings.
 */
router
  .get({ query: StdQuery })
  .handler(() => {}, {
    code: StatusCodes.OK,
    description: "successfully listed",
    schema: zodToJsonSchema(AsList(SomethingSchema)),
  })
  .tags("something")
  .summary("List somethings")
  .description("Route for listing <FTName | plural_pascalcase>, returns the list of Somethings.");

export default router;
