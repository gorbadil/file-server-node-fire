import { Endpoint } from "@ooic/router"
import { StatusCodes } from "http-status-codes";
import zodToJsonSchema from "zod-to-json-schema"

import * as <FTName> from "~/handlers/<FTName>"
import { StdQuery, WithId, AsList } from "~/router/___util"

import { <FTName | pascalcase>Schema } from "./___schema"

const endpoint = new Endpoint()

// Route for creating a new <FTName | camelcase>.
endpoint
  .post({ body: <FTName | pascalcase>Schema })
  .handler(<FTName>.create)
  .tags("<FTName>")
  .summary("Create a new <FTName | camelcase>")
  .description("Route for creating a new <FTName | camelcase>, returns the created <FTName | camelcase>")

// Route for listing <FTName | plural?pascalcase>.
endpoint
  .get({ query: StdQuery })
  .handler(<FTName>.list)
  .tags("<FTName>")
  .summary("List <FTName | camelcase?plural>")
  .description("Route for listing <FTName | plural?pascalcase>, returns the list of <FTName | plural?pascalcase>.")

export default endpoint
