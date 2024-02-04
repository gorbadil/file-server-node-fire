import { Endpoint } from "@ooic/router"
import { StatusCodes } from "http-status-codes";
import zodToJsonSchema from "zod-to-json-schema";

import * as folder from "~/handlers/folder";
import { WithId } from "~/router/___util"

import { FolderSchema } from "./___schema"

const endpoint = new Endpoint(/* handlers.auth.verifyToken */)

// Route for getting an folder by ID.
endpoint
  .get()
  .handler(folder.findById)
  .tags("folder")
  .summary("Find folder by ID")
  .description("Route for getting an folder by ID, returns the folder that matching ID")


// Route for updating an folder.
endpoint
  .put({ body: FolderSchema })
  .handler(folder.update)
  .tags("folder")
  .summary("Update folder by ID")
  .description("Route for updating an folder, returns the updated folder.")

// Route for patching an folder.
endpoint
  .patch({ body: FolderSchema.partial() })
  .handler(folder.patch)
  .tags("folder")
  .summary("Patch folder by ID")
  .description("Route for patching an folder.")


// Route for deleting an folder by ID.
endpoint
  .delete()
  .handler(folder.destroy)
  .tags("folder")
  .summary("Delete folder by ID")
  .description("Route for deleting an folder by ID.")

export default endpoint
