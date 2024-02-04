import { Endpoint } from "@ooic/router"
import { StatusCodes } from "http-status-codes";
import zodToJsonSchema from "zod-to-json-schema";

import * as <FTName> from "~/handlers/<FTName>";
import { WithId } from "~/router/___util"

import { <FTName | pascalcase>Schema } from "./___schema"

const endpoint = new Endpoint(/* handlers.auth.verifyToken */)

// Route for getting an <FTName | camelcase> by ID.
endpoint
  .get()
  .handler(<FTName>.findById)
  .tags("<FTName>")
  .summary("Find <FTName | camelcase> by ID")
  .description("Route for getting an <FTName | camelcase> by ID, returns the <FTName | camelcase> that matching ID")


// Route for updating an <FTName | camelcase>.
endpoint
  .put({ body: <FTName | pascalcase>Schema })
  .handler(<FTName>.update)
  .tags("<FTName>")
  .summary("Update <FTName | camelcase> by ID")
  .description("Route for updating an <FTName | camelcase>, returns the updated <FTName | camelcase>.")

// Route for patching an <FTName | camelcase>.
endpoint
  .patch({ body: <FTName | pascalcase>Schema.partial() })
  .handler(<FTName>.patch)
  .tags("<FTName>")
  .summary("Patch <FTName | camelcase> by ID")
  .description("Route for patching an <FTName | camelcase>.")


// Route for deleting an <FTName | camelcase> by ID.
endpoint
  .delete()
  .handler(<FTName>.destroy)
  .tags("<FTName>")
  .summary("Delete <FTName | camelcase> by ID")
  .description("Route for deleting an <FTName | camelcase> by ID.")

export default endpoint
