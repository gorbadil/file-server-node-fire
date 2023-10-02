import { Express, Request, Response, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import { JSONSchemaFaker, Schema } from "json-schema-faker";
import zodToJsonSchema from "zod-to-json-schema";
import { RouteField, routeFields, routes } from "./router";
import { baseUrl } from "@ooic/core";
import { existsSync, readFileSync } from "fs";
import path from "path";
import { ooicConfig } from "@ooic/core";
import { StatusCodes } from "http-status-codes";
import { HttpError } from "@ooic/utils";
import { SwaggerEndpoint } from "./types";
import { OpenAPIV2 } from "openapi-types";

const docsCache: any = {};

const generateDoc = (pathPrefix?: string) => {
  let doc: any;
  if (pathPrefix && docsCache[pathPrefix]) {
    doc = docsCache[pathPrefix];
  } else if (!pathPrefix && docsCache.__default) {
    doc = docsCache.__default;
  }
  if (doc) return doc;

  const baseJson: any = {};

  const pRoot = path.resolve(__dirname, `./../../../src/router/swagger.base.json`);
  const pPrefixed = path.resolve(__dirname, `./../../../src/router/${pathPrefix}/swagger.base.json`);
  const pFinal = pathPrefix ? pPrefixed : pRoot;
  Object.assign(baseJson, JSON.parse(readFileSync(pFinal).toString()));

  doc = {
    swagger: "2.0",
    host: `${baseUrl}`,
    basePath: `${pathPrefix ? "/" + pathPrefix : ""}`,
    schemes: ["http"],
    paths: {},
  };
  Object.assign(doc, baseJson);
  pathPrefix ? (docsCache[pathPrefix] = doc) : (docsCache.__default = doc);
  routes.forEach((route) => {
    if (pathPrefix && !route.path.startsWith("/" + pathPrefix)) return;
    const cleaned = pathPrefix ? route.path.replace("/" + pathPrefix, "") : route.path;
    const converted = cleaned.replace(/:(\w+)/g, "{$1}");
    const path = (doc.paths[converted] = doc.paths[converted] || {});

    const settledFields = routeFields.reduce((prev, curr) => {
      prev[curr] = route[curr];
      return prev;
    }, {} as Record<RouteField, any>);

    path[route.method] = Object.assign(path[route.method] || {}, {
      consumes: ["application/json"],
      produces: ["application/json"],
      parameters: [],
      ...settledFields,
    } satisfies SwaggerEndpoint);
    const method: SwaggerEndpoint = path[route.method];

    const pathParams = converted.match(/{([^{}]+)}/g);
    if (pathParams) {
      method.parameters = pathParams.map((param) => ({
        type: "string",
        name: param.replace(/[{}]/g, ""),
        in: "path",
        required: true,
      }));
    }
    const jsonSchema: Record<"query" | "body", Schema> = {} as any;
    const faker: Record<"query" | "body", any> = {} as any;

    if (route.schema && "query" in route.schema && route.schema.query)
      jsonSchema.query = zodToJsonSchema(route.schema.query) as Schema;
    if (jsonSchema.query) faker.query = JSONSchemaFaker.generate(jsonSchema.query);

    if (route.schema && "body" in route.schema && route.schema.body)
      jsonSchema.body = zodToJsonSchema(route.schema.body) as Schema;
    if (jsonSchema.body) faker.body = JSONSchemaFaker.generate(jsonSchema.body);

    if (jsonSchema.body) {
      method.parameters.push({
        in: "body",
        name: "body",
        required: true,
        schema: jsonSchema.body,
      } as OpenAPIV2.Parameter);
    }
    if (jsonSchema.query) {
      Object.entries(jsonSchema.query.properties || {}).forEach(([key, value]: any) => {
        method.parameters.push({
          in: "query",
          name: key,
          type: value.type,
        });
      });
    }
  });
  return doc;
};

const ApiVersionNotFoundError = (version) =>
  new HttpError(StatusCodes.BAD_REQUEST, `There is no API definition or endpoints${version ? " in " + version : ""}.`);

const generateSwaggerJson = (version?: string) => {
  if (version && !ooicConfig.allowedVersions.includes(version)) {
    throw ApiVersionNotFoundError(version);
  }
  const baseJsonPath = version
    ? path.resolve(__dirname, `./../../../src/router/${version}/swagger.base.json`)
    : path.resolve(__dirname, `./../../../src/router/swagger.base.json`);

  if (!existsSync(baseJsonPath)) {
    throw ApiVersionNotFoundError(version);
  }

  return generateDoc(version);
};
export const swaggerify = (app: Express) => {
  app.get("/:path/swagger.json", (request: Request, response: Response, next: NextFunction) => {
    try {
      const swaggerJson = generateSwaggerJson(request.params.path);
      response.status(200).send(swaggerJson).json();
    } catch (err) {
      next(err);
    }
  });
  app.use("/:path/___docs/", swaggerUi.serve, (request: Request, response: Response, next: NextFunction) => {
    try {
      const version = request.params.path;
      const swaggerJsonUrl = `${request.protocol}://${generateDoc(version).host}/${version}/swagger.json`;
      swaggerUi.setup(undefined, undefined, undefined, undefined, undefined, swaggerJsonUrl)(request, response, next);
    } catch (error) {
      next(error);
    }
  });

  app.get("/swagger.json", (request: Request, response: Response, next: NextFunction) => {
    try {
      const swaggerJson = generateSwaggerJson();
      response.status(200).send(swaggerJson).json();
    } catch (err) {
      next(err);
    }
  });
  app.use("/___docs", swaggerUi.serve, (request: Request, response: Response, next: NextFunction) => {
    try {
      const swaggerJsonUrl = `${request.protocol}://${generateDoc().host}/swagger.json`;
      swaggerUi.setup(undefined, undefined, undefined, undefined, undefined, swaggerJsonUrl)(request, response, next);
    } catch (err) {
      next(err);
    }
  });
};
