import { RequestHandler } from "express";
import { OperationBuilder } from "./OperationBuilder.class";

import {
  MethodsStore,
  RequestConnectSchemaType,
  RequestDeleteSchemaType,
  RequestGetSchemaType,
  RequestHeadSchemaType,
  RequestOptionsSchemaType,
  RequestPatchSchemaType,
  RequestPostSchemaType,
  RequestPutSchemaType,
  RequestTraceSchemaType,
} from "./types";

/**
 * Represents an endpoint with different HTTP method handlers.
 * It will get route path from file system based path
 */
export class Endpoint {
  /**
   * The route path for this endpoint.
   * @private
   */
  private _path: string;

  /**
   * An array of common handlers shared by all methods under this endpoint.
   * @private
   */
  private commonHandlers: RequestHandler[] = [];

  /**
   * A store for different HTTP method handlers associated with this endpoint.
   * @private
   */
  private operationBuilders: MethodsStore<OperationBuilder> = {};
  /**
   * Constructs a new instance of the Endpoint class with the provided handlers.
   * @param handlers - An array of handlers for the endpoint. These handlers will affect all methods under this endpoint.
   */
  constructor(...handlers: RequestHandler[]) {
    this.commonHandlers = handlers;
  }

  /**
   * Sets the path for the endpoint.
   * @param path - The route path for the endpoint.
   * @returns The current instance of the Endpoint with the updated path.
   */
  path(path: string) {
    this._path = path;
    return this;
  }

  /**
   * Sets the schema for the HEAD method and returns the handler constructor.
   * @param schema - The request schema for validation.
   * @returns The operation builder instance.
   */
  head(schema?: RequestHeadSchemaType) {
    return (this.operationBuilders.head ||= new OperationBuilder(schema));
  }

  /**
   * Sets the schema for the POST method and returns the handler constructor.
   * @param schema - The request schema for validation.
   * @returns The operation builder instance.
   */
  post(schema?: RequestPostSchemaType) {
    return (this.operationBuilders.post ||= new OperationBuilder(schema));
  }

  /**
   * Sets the schema for the GET method and returns the handler constructor.
   * @param schema - The request schema for validation.
   * @returns The operation builder instance.
   */
  get(schema?: RequestGetSchemaType) {
    return (this.operationBuilders.get ||= new OperationBuilder(schema));
  }

  /**
   * Sets the schema for the PUT method and returns the handler constructor.
   * @param schema - The request schema for validation.
   * @returns The operation builder instance.
   */
  put(schema?: RequestPutSchemaType) {
    return (this.operationBuilders.put ||= new OperationBuilder(schema));
  }

  /**
   * Sets the schema for the PATCH method and returns the handler constructor.
   * @param schema - The request schema for validation.
   * @returns The operation builder instance.
   */
  patch(schema?: RequestPatchSchemaType) {
    return (this.operationBuilders.patch ||= new OperationBuilder(schema));
  }

  /**
   * Sets the schema for the DELETE method and returns the handler constructor.
   * @param schema - The request schema for validation.
   * @returns The operation builder instance.
   */
  delete(schema?: RequestDeleteSchemaType) {
    return (this.operationBuilders.delete ||= new OperationBuilder(schema));
  }

  /**
   * Sets the schema for the OPTIONS method and returns the handler constructor.
   * @param schema - The request schema for validation.
   * @returns The operation builder instance.
   */
  options(schema?: RequestOptionsSchemaType) {
    return (this.operationBuilders.options ||= new OperationBuilder(schema));
  }

  /**
   * Sets the schema for the CONNECT method and returns the handler constructor.
   * @param schema - The request schema for validation.
   * @returns The operation builder instance.
   */
  connect(schema?: RequestConnectSchemaType) {
    return (this.operationBuilders.connect ||= new OperationBuilder(schema));
  }

  /**
   * Sets the schema for the TRACE method and returns the handler constructor.
   * @param schema - The request schema for validation.
   * @returns The operation builder instance.
   */
  trace(schema?: RequestTraceSchemaType) {
    return (this.operationBuilders.trace ||= new OperationBuilder(schema));
  }

  private _load(path: string, middleware: RequestHandler[] = []) {
    path = path.replace("~/router", "").replaceAll("[", ":").replaceAll("]", "");
    return Object.entries(this.operationBuilders).map(([method, operation]) =>
      /*@ts-ignore-next-line*/
      operation._load(method, this._path || path, [...middleware, ...this.commonHandlers])
    );
  }
}
