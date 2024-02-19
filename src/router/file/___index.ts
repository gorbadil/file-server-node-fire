import { Endpoint } from "@ooic/router"
import { StatusCodes } from "http-status-codes";
import zodToJsonSchema from "zod-to-json-schema"

import * as file from "~/handlers/file"
import { StdQuery, WithId, AsList } from "~/router/___util"

import { FileSchema } from "./___schema"

const endpoint = new Endpoint()

// Route for creating a new file.
endpoint
  .post({ body: FileSchema })
  .handler(file.create)
  .tags("file")
  .summary("Create a new file")
  .description("Route for creating a new file, returns the created file")

// Route for listing Files.
endpoint
  .get({ query: StdQuery(FileSchema) })
  .handler(file.list)
  .tags("file")
  .summary("List files")
  .description("Route for listing Files, returns the list of Files.")

export default endpoint
