import { Endpoint } from "@ooic/router"
import { StatusCodes } from "http-status-codes";
import zodToJsonSchema from "zod-to-json-schema"

import * as folder from "~/handlers/folder"
import { StdQuery, WithId, AsList } from "~/router/___util"

import { FolderSchema } from "./___schema"

const endpoint = new Endpoint()

// Route for creating a new folder.
endpoint
  .post({ body: FolderSchema })
  .handler(folder.create)
  .tags("folder")
  .summary("Create a new folder")
  .description("Route for creating a new folder, returns the created folder")

// Route for listing Folders.
endpoint
  .get({ query: StdQuery(FolderSchema) })
  .handler(folder.list)
  .tags("folder")
  .summary("List folders")
  .description("Route for listing Files, returns the list of Folders.")

export default endpoint
