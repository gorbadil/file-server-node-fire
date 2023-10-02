import { Endpoint } from "@ooic/router";

import { StdQuery } from "~/router/___util";
import { SomethingSchema } from "./../___schema";
import zodToJsonSchema from "zod-to-json-schema";

const router = new Endpoint(/* handlers.auth.verifyToken */);

/**
 * Route for creating a new something.
 * @name Create Something
 * @route POST /something
 * @returns {Something} The created something.
 */
router
  .post({ body: SomethingSchema})
  .handler(() => console.log("endpoint"))
  .tags("something")
  .description("somethind")
  .response(200, { description: "successfully operation", schema: zodToJsonSchema(SomethingSchema) })

/**
 * Route for listing Somethings.
 * @name List Somethings
 * @route GET /something
 * @param {string} sortBy - The field to sort the Somethings by.
 * @param {string} sortType - The sort type ('asc' or 'desc').
 * @returns {count: number,result:Something[], page: number, pageSize: number, pageCount: number } The list of Somethings.
 */
router
  .get({ query: StdQuery })
  .handler(() => console.log("endpoint"))
  .tags("something");

export default router;
