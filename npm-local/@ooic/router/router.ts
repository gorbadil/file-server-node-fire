import fs from "fs";
import path from "path";
import { Express, RequestHandler } from "express";
import { Endpoint } from "./Endpoint.class";
import { RequestSchemaType, Route, BoundRoute, BuildReturn, HandlerWithResponse } from "./types";
import { StatusCodes } from "http-status-codes";

export const routes: BoundRoute[] = [];

export const routeFields = [
  "deprecated",
  "description",
  "externalDocs",
  "operationId",
  "responses",
  "schema",
  "summary",
  "tags",
] as const;
export type RouteField = (typeof routeFields)[number];
/**
 * Loads route files from a specified folder and mounts them on the Express app.
 * @param app - The Express app instance.
 * @param folderName - The name of the folder containing the route files.
 */
const loadRouteFolder = async (
  folderName: string = "./../../../src/router",
  middleware: Array<HandlerWithResponse> = []
) => {
  const p = path.resolve(__dirname, folderName);
  const items = fs.readdirSync(`${p}/`, {
    withFileTypes: true,
  });
  const middlewareDefinition = items.find((item) => removeExtension(item.name) === "___middleware");
  const _middleWare = [...middleware];

  if (middlewareDefinition) {
    const middlewareFile = await import(
      "~/router" + `${sanitizePath(folderName)}/${removeExtension(middlewareDefinition.name)}`
    );
    _middleWare.push(...middlewareFile.default);
  }
  for (let item of items) {
    if (item.isFile()) {
      if (!["js", "ts"].includes(item.name.split(".").pop())) continue;
      const y = `${sanitizePath(folderName)}/${removeExtension(item.name)}`;
      const loadedModule = await import("~/router" + y);
      const name = item.name.replace(/\.[^.]*$/, "");
      const router = loadedModule.default;
      if (name.substring(0, 3) !== "___") routeLoader(router, `${sanitizePath(folderName)}/${name}`, _middleWare);
      else if (name === "___index") routeLoader(router, `${sanitizePath(folderName)}`, _middleWare);
    } else {
      await loadRouteFolder(folderName + "/" + item.name, _middleWare);
    }
  }
};

const sanitizePath = (path: string) => path.replace("~/router", "").replace("./../../../src/router", "");
const removeExtension = (name: string) => name.replace(".js", "").replace(".ts", "");

/**
 * Mounts a route on the Express app.
 * @param app - The Express app instance.
 * @param router - The router object representing the route.
 * @param path - The path where the route should be mounted.
 * @param middleware - Optional middleware to be applied to the route.
 */
const routeLoader = (router: Endpoint | Route, path: string, middleware: HandlerWithResponse[] = []) => {
  path = path.replace("~/router", "").replaceAll("[", ":").replaceAll("]", "");
  if (router instanceof Endpoint) {
    // @ts-ignore
    const _router = router._build();
    if (_router?.routes) {
      _router.routes.forEach((subRoute) => {
        routeLoader(subRoute, `${path}`, [...middleware]);
      });
    }
  } else if ("method" in router) {
    const _router: Route = router;

    const handlers = [
      ...middleware,
      ...(_router.schema ? [RequestValidationCtor(_router.schema), ..._router.handlers] : [..._router.handlers]),
    ];

    _router.responses = Object.assign(
      _router.responses || {},
      handlers.reduce((prev, curr) => {
        curr.responses.forEach((res) => (prev[String(res.code)] = res));
        return prev;
      }, {} satisfies any)
    );

    const settledFields = routeFields.reduce((prev, curr) => {
      prev[curr] = _router[curr];
      return prev;
    }, {} as Record<RouteField, any>);
    const route: BoundRoute = {
      method: _router.method,
      path,
      handlers,
      ...settledFields,
    };
    routes.push(route);
  }
};

/**
 * Initializes the router by loading route files from the specified folder and mounting them on the Express app.
 * @param app - The Express app instance.
 */
export const load = async () => {
  await loadRouteFolder();
  return routes;
};

/**
 * Constructs a request validation middleware based on the provided schema.
 * @param schema - The request schema for validation.
 * @returns The request validation middleware.
 */
const RequestValidationCtor = (schema: RequestSchemaType): HandlerWithResponse => {
  const handler: RequestHandler = async (request, _response, next) => {
    try {
      if (schema.body) request.body = schema.body.parse(request.body);
      if (schema.query) request.query = schema.query.parse(request.query);
      next();
    } catch (error) {
      next(error);
    }
  };
  return {
    handler,
    responses: [
      {
        code: StatusCodes.BAD_REQUEST,
        description: "Zod Schema Validation Error",
        schema: {
          $schema: "http://json-schema.org/draft-04/schema#",
          type: "object",
          properties: {
            issues: {
              type: "array",
              items: [
                {
                  type: "object",
                  properties: {
                    code: {
                      type: "string",
                    },
                    expected: {
                      type: "string",
                    },
                    received: {
                      type: "string",
                    },
                    path: {
                      type: "array",
                      items: [
                        {
                          type: "string",
                        },
                      ],
                    },
                    message: {
                      type: "string",
                    },
                  },
                  required: ["code", "expected", "received", "path", "message"],
                },
              ],
            },
            name: {
              type: "string",
            },
          },
          required: ["issues", "name"],
        },
      },
    ],
  };
};

export const mount = (app: Express) => {
  routes.forEach((route) => {
    app[route.method](route.path, ...route.handlers.map((h) => h.handler));
  });
};
