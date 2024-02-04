import fs from "fs";
import path from "path";
import { Express, RequestHandler } from "express";
import { Endpoint } from "./Endpoint.class";
import { BoundRoute } from "./types";
import {
  CustomEndpointLoadError,
  DefaultEndpointLoadError,
  DefaultExportIsNotAnEndpointError,
  HasNoDefaultExportedEndpoint,
} from "./errors";

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

/**
 * Loads route files from a specified folder and mounts them on the Express app.
 * @param app - The Express app instance.
 * @param folderName - The name of the folder containing the route files.
 */
const loadRouteFolder = async (
  folderName: string = "./../../../src/router",
  middleware: Array<RequestHandler> = []
) => {
  const p = path.resolve(__dirname, folderName);
  const items = fs.readdirSync(`${p}/`, {
    withFileTypes: true,
  });
  const middlewareDefinition = items.find((item) => removeExtension(item.name) === "___middleware");
  const _middleware = [...middleware];

  if (middlewareDefinition) {
    const middlewareFile = await import(
      "~/router" + `${sanitizePath(folderName)}/${removeExtension(middlewareDefinition.name)}`
    );
    _middleware.push(...middlewareFile.default);
  }
  for (let item of items) {
    if (item.isFile()) {
      const ext = item.name.split(".").pop();
      if (!["js", "ts"].includes(ext)) continue;
      const y = `${sanitizePath(folderName)}/${removeExtension(item.name)}`;
      const loadedModule = await import("~/router" + y);
      const name = item.name.replace(/\.[^.]*$/, "");
      if (name.slice(0, 3) !== "___" && !loadedModule.default)
        throw HasNoDefaultExportedEndpoint(`${sanitizePath(folderName)}/${name}.${ext}`);

      Object.entries(loadedModule).forEach(([key, value]) => {
        if (name.slice(0, 3) === "___" && name !== "___index") return;

        if (!(value instanceof Endpoint) && key === "default")
          throw DefaultExportIsNotAnEndpointError(`${sanitizePath(folderName)}/${name}.${ext}`);
        // @ts-ignore
        if (key === "default" && value._path)
          throw DefaultEndpointLoadError(`${sanitizePath(folderName)}/${name}.${ext}`);
        // @ts-ignore
        if (key !== "default" && !value._path)
          throw CustomEndpointLoadError(key, `${sanitizePath(folderName)}/${name}.${ext}`);
        if (value instanceof Endpoint) loadEndpointModule(value, folderName, name, _middleware);
      });
    } else {
      await loadRouteFolder(folderName + "/" + item.name, _middleware);
    }
  }
};

const loadEndpointModule = (
  endpoint: Endpoint,
  folderName: null | string,
  name: null | string,
  middleware: RequestHandler[]
) => {
  name = String(name);
  folderName = String(folderName);
  if (name === "___index") {
    // @ts-ignore
    routes.push(...endpoint._load(`${sanitizePath(folderName)}`, middleware));
  } else {
    // @ts-ignore
    routes.push(...endpoint._load(`${sanitizePath(folderName)}/${name}`, middleware));
  }
};

const sanitizePath = (path: string) => path.replace("~/router", "").replace("./../../../src/router", "");
const removeExtension = (name: string) => name.replace(".js", "").replace(".ts", "");

/**
 * Initializes the router by loading route files from the specified folder and mounting them on the Express app.
 * @param app - The Express app instance.
 */
export const load = async () => {
  await loadRouteFolder();
  return routes;
};

export const mount = (app: Express) => {
  routes.forEach((route) => {
    app[route.method](route.path, ...route.handlers);
  });
};
