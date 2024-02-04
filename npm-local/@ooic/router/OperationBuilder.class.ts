import { OpenAPIV2 } from "openapi-types";
import { StatusCodes } from "http-status-codes";
import { RequestHandler } from "express";

import {
  AnyValidationSchema,
  BoundRoute,
  HttpMethod,
  ResponseObject,
  ResponseWithStatusCode,
  RouteField,
} from "./types";
import { routeFields } from "./router";
import { deepMerge } from "@ooic/utils";
import { RequestValidationCtor } from "./RequestValidationCtor";

/**
 * Represents a builder for defining operations within an endpoint.
 */
export class OperationBuilder {
  /**
   * Indicates if this operation is deprecated.
   */
  private _deprecated: boolean;

  /**
   * The description of this operation.
   */
  private _description: string;

  /**
   * External documentation for this operation.
   */
  private _externalDocs: OpenAPIV2.ExternalDocumentationObject;

  /**
   * Handlers associated with this operation.
   */
  private _handlers: RequestHandler[];

  /**
   * The unique identifier for this operation.
   */
  private _operationId: string;

  /**
   * Responses defined for this operation.
   */
  private _responses: Record<string, OpenAPIV2.ResponseObject>;

  /**
   * A short summary of what this operation does.
   */
  private _summary: string;

  /**
   * Tags associated with this operation.
   */
  private _tags: Array<string>;

  /**
   * Constructs an OperationBuilder.
   * @param schema - An optional validation schema for the operation.
   */
  constructor(private schema?: AnyValidationSchema) {}

  /**
   * Sets a possible response as they are returned from executing this operation for a specific status code.
   * @param code - The status code for the response.
   * @param value - The response object.
   * @returns The current OperationBuilder instance.
   */
  public response(code: StatusCodes, value: ResponseObject) {
    this._responses = this._responses || {};
    this._responses[String(code)] = value as OpenAPIV2.ResponseObject;
    return this;
  }

  /**
   * Sets the description for this operation.
   * @param description - The description of the operation.
   * @returns The current OperationBuilder instance.
   */
  public description(description: string) {
    this._description = description;
    return this;
  }

  /**
   * Marks this operation as deprecated.
   * @returns The current OperationBuilder instance.
   */
  public deprecated() {
    this._deprecated = true;
    return this;
  }

  /**
   * Sets external documentation for this operation.
   * @param externalDocs - The external documentation object.
   * @returns The current OperationBuilder instance.
   */
  public externalDocs(externalDocs: OpenAPIV2.ExternalDocumentationObject) {
    this._externalDocs = externalDocs;
    return this;
  }

  /**
   * Sets a short summary of what the operation does.
   * @param summary - The summary of the operation.
   * @returns The current OperationBuilder instance.
   */
  public summary(summary: string) {
    this._summary = summary;
    return this;
  }

  /**
   * Sets the unique string used to identify the operation.
   * @param operationId - The unique identifier for the operation.
   * @returns The current OperationBuilder instance.
   */
  public operationId(operationId: string) {
    this._operationId = operationId;
    return this;
  }

  /**
   * Adds tags to the list of tags for API documentation control.
   * @param tags - The tags to be added.
   * @returns The current OperationBuilder instance.
   */
  public tags(...tags: string[]) {
    this._tags = this._tags || [];
    this._tags.push(...tags);
    return this;
  }

  /**
   * Adds request handlers to this operation.
   * @param handler - The request handler.
   * @returns The current OperationBuilder instance.
   */
  public handler(handler: RequestHandler) {
    this._handlers = this._handlers || [];
    this._handlers.push(handler);
    return this;
  }

  private _load(method: HttpMethod, path: string, middleware: RequestHandler[]) {
    const handlers = [
      ...middleware,
      ...(this.schema ? [RequestValidationCtor(this.schema), ...this._handlers] : this._handlers),
    ];

    const settledFields = routeFields.reduce((prev, curr) => {
      prev[curr] = this[`_${curr}`];
      return prev;
    }, {} as Record<RouteField, any>);

    if (this.schema) {
      settledFields.schema = this.schema;
    }

    const route: BoundRoute = {
      method,
      path,
      handlers,
      ...settledFields,
    };
    return route;
  }
}
