import { Endpoint } from "@ooic/router"
import { StatusCodes } from "http-status-codes";
import zodToJsonSchema from "zod-to-json-schema";

import { WithId } from "~/router/___util"

import { SomethingSchema } from "./___schema"

const router = new Endpoint(/* handlers.auth.verifyToken */)

/**
 * Route for getting an something by ID.
 * @name Get Something by ID
 * @route GET /something/:id
 * @returns {Something} The something with the specified ID.
 */
router
  .get()
  .handler(()=>{},{
    code: StatusCodes.OK,
    description: "successfuly found",
    schema: zodToJsonSchema(WithId(SomethingSchema)),
  })
  .tags("something")
  .summary("Find something by ID")
  .description("Route for getting an something by ID, returns the something that matching ID")


/**
 * Route for updating an something.
 * @name Update Something
 * @route PUT /something/:id
 * @param {Something} body - The request body.
 * @returns {Something} The updated something.
 */
router
  .put({ body: SomethingSchema })
  .handler(()=>{},{
    code: StatusCodes.OK,
    description: "successfully updated",
    schema: zodToJsonSchema(WithId(SomethingSchema)),
  })
  .tags("something")
  .summary("Update something by ID")
  .description("Route for updating an something, returns the updated something.")

/**
 * Route for patching an something.
 * @name Patch Something
 * @route PATCH /something/:id
 * @param {Something} body - The request body.
 * @returns {Something} The updated something.
 */
router
  .patch({ body: SomethingSchema.partial() })
  .handler(()=>{},{
    code:StatusCodes.OK,
    description: "successfully patched",
    schema: zodToJsonSchema(WithId(SomethingSchema)),
  })
  .tags("something")
  .summary("Patch something by ID")
  .description("Route for patching an something.")


/**
 * Route for deleting an something by ID.
 * @name Delete Something by ID
 * @route DELETE /something/:id
 * @returns {Something} The something with the specified ID.
 */
router
  .delete()
  .handler(()=>{},{
    code:StatusCodes.OK,
    description: "successfully deleted",
    schema: zodToJsonSchema(WithId(SomethingSchema)),
  })
  .tags("something")
  .summary("Delete something by ID")
  .description("Route for deleting an something by ID.")

  router

export default router
