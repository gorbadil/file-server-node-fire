import { Endpoint } from "@ooic/router"
import { StatusCodes } from "http-status-codes";
import zodToJsonSchema from "zod-to-json-schema";

import * as <FTName> from "~/handlers/<FTName>";
import { WithId } from "~/router/___util"

import { <FTName | pascalcase>Schema } from "./___schema"

const router = new Endpoint(/* handlers.auth.verifyToken */)

// Route for getting an <FTName | camelcase> by ID.
router
  .get()
  .handler(<FTName>.findById,{
    code: StatusCodes.OK,
    description: "successfuly found",
    schema: zodToJsonSchema(WithId(<FTName | pascalcase>Schema)),
  })
  .tags("<FTName>")
  .summary("Find <FTName | camelcase> by ID")
  .description("Route for getting an <FTName | camelcase> by ID, returns the <FTName | camelcase> that matching ID")


// Route for updating an <FTName | camelcase>.
router
  .put({ body: <FTName | pascalcase>Schema })
  .handler(<FTName>.update,{
    code: StatusCodes.OK,
    description: "successfully updated",
    schema: zodToJsonSchema(WithId(<FTName | pascalcase>Schema)),
  })
  .tags("<FTName>")
  .summary("Update <FTName | camelcase> by ID")
  .description("Route for updating an <FTName | camelcase>, returns the updated <FTName | camelcase>.")

// Route for patching an <FTName | camelcase>.
router
  .patch({ body: <FTName | pascalcase>Schema.partial() })
  .handler(<FTName>.patch,{
    code:StatusCodes.OK,
    description: "successfully patched",
    schema: zodToJsonSchema(WithId(<FTName | pascalcase>Schema)),
  })
  .tags("<FTName>")
  .summary("Patch <FTName | camelcase> by ID")
  .description("Route for patching an <FTName | camelcase>.")


// Route for deleting an <FTName | camelcase> by ID.
router
  .delete()
  .handler(<FTName>.destroy,{
    code:StatusCodes.OK,
    description: "successfully deleted",
    schema: zodToJsonSchema(WithId(<FTName | pascalcase>Schema)),
  })
  .tags("<FTName>")
  .summary("Delete <FTName | camelcase> by ID")
  .description("Route for deleting an <FTName | camelcase> by ID.")

export default router
