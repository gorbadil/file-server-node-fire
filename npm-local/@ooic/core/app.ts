import https from "https";
import http from "http";
import express, { ErrorRequestHandler } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { OoicConfig } from "./types";
import * as router from "@ooic/router";
import { initErrorHandlers } from "./init-error-handlers";
import { queryParser } from "express-query-parser";
import packageJson from "./../../../package.json";
import { isPortOk } from "@ooic/utils";
import { StatusCodes } from "http-status-codes";

export let baseUrl = process.env.BASE_URL;
export const ooicConfig: OoicConfig = {} as OoicConfig;
export async function ooic(config: OoicConfig) {
  Object.assign(ooicConfig, config);
  const app = express();
  config.cors?.enabled && app.use(cors(config.cors.options));
  config.morgan?.enabled &&
    process.env.NODE_ENV === "development" &&
    app.use(morgan(config.morgan.format, config.morgan.options));
  config.cookieParser?.enabled && app.use(cookieParser(config.cookieParser.secret, config.cookieParser.options));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));
  app.use(express.json());
  app.use(
    queryParser({
      parseNumber: true,
      parseBoolean: true,
      parseNull: true,
      parseUndefined: true,
    })
  );

  await router.load();
  router.swaggerify(app);
  router.mount(app);

  await initErrorHandlers(app);

  /*
    If the error object has a specified status code, it sends that status code
    along with the error message as the response.Otherwise, it defaults to a
    500 Internal Server Error status code and sends the entire error object as the response.
  */
  const unhandledErrorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
    if (error.statusCode)
      return response
        .status(error.statusCode)
        .send(error.message || error)
        .json();
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(process.env.NODE_ENV === "development" ? error : null)
      .json();
  };
  app.use(unhandledErrorHandler);

  if (process.env.NODE_ENV === "development") {
    const httpPort = await isPortOk(process.env.APP_PORT as string); //find next available port
    baseUrl = baseUrl.replace(`:${process.env.APP_PORT}`, `:${httpPort}`);
    http.createServer(app).listen(httpPort);
    console.log(
      `\nWelcome to ${packageJson.name} v${packageJson.version}! Listening on port ${httpPort}` +
        `\nRunning on environment: ${process.env.NODE_ENV}` +
        `\nhttp://${baseUrl}`
    );
    return app;
  }

  http.createServer(app).listen(process.env.APP_PORT as string);
  config.ssl?.enabled &&
    https.createServer({ cert: config.ssl.cert, key: config.ssl.key }, app).listen(process.env.SECURE_PORT);
  console.log(
    `\nWelcome to ${packageJson.name} v${packageJson.version}! Listening on port ${process.env.APP_PORT} ${
      config.ssl?.enabled ? `and ${process.env.SECURE_PORT}` : ""
    }` + `\nRunning on environment: ${process.env.NODE_ENV}`
  );

  return app;
}
