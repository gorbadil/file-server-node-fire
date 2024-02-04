import { resolve } from "path";

import { RouterError } from "./RouterError.class";
export const DefaultEndpointLoadError = (path: string) =>
  new RouterError(
    1001,
    `Route in '${resolve(__dirname, "../../../src/router")}${path}' couldn't load due to a possible path conflict.
The default exported Endpoint instance cannot have a 'path' setting.`
  );

export const CustomEndpointLoadError = (key: string, path: string) =>
  new RouterError(
    1002,
    `Route '${key}' in '${resolve(
      __dirname,
      "../../../src/router"
    )}${path}' couldn't load due to a possible path conflict.
Non-default exported Endpoint instance MUST have a 'path' setting.`
  );

export const DefaultExportIsNotAnEndpointError = (path: string) =>
  new RouterError(
    1003,
    `Route in '${resolve(__dirname, "../../../src/router")}${path}' couldn't load due to a missing default export .
Default exports of every modules under '~/router' needs a be Endpoint instance except ___files.`
  );

export const HasNoDefaultExportedEndpoint = (path: string) =>
  new RouterError(
    1004,
    `Route in '${resolve(__dirname, "../../../src/router")}${path}' couldn't load due to a missing default export .
All modules under '~/router' needs a default export except ___files.`
  );
