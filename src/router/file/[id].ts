import { Endpoint } from "@ooic/router"
import { StatusCodes } from "http-status-codes";
import zodToJsonSchema from "zod-to-json-schema";

import * as file from "~/handlers/file";
import { WithId } from "~/router/___util"

import { FileSchema } from "./___schema"

const endpoint = new Endpoint(/* handlers.auth.verifyToken */)

// Route for getting an file by ID.
endpoint
  .get()
  .handler(file.findById)
  .tags("file")
  .summary("Find file by ID")
  .description("Route for getting an file by ID, returns the file that matching ID")


// Route for updating an file.
endpoint
  .put({ body: FileSchema })
  .handler(file.update)
  .tags("file")
  .summary("Update file by ID")
  .description("Route for updating an file, returns the updated file.")

// Route for patching an file.
endpoint
  .patch({ body: FileSchema.partial() })
  .handler(file.patch)
  .tags("file")
  .summary("Patch file by ID")
  .description("Route for patching an file.")


// Route for deleting an file by ID.
endpoint
  .delete()
  .handler(file.destroy)
  .tags("file")
  .summary("Delete file by ID")
  .description("Route for deleting an file by ID.")

export default endpoint
