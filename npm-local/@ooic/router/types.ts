import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodSchema } from "zod";
import { OpenAPIV2 } from "openapi-types";
import { JsonSchema7Type } from "zod-to-json-schema/src/parseDef";

export type ResponseObject =
  | OpenAPIV2.ResponseObject
  | {
      description: string;
      schema?: JsonSchema7Type;
      headers?: OpenAPIV2.HeadersObject;
      examples?: OpenAPIV2.ExampleObject;
    };
export type ResponseWithStatusCode = ResponseObject & {
  code: StatusCodes;
};
export type HandlerWithResponse = {
  handler: RequestHandler;
  responses: Partial<ResponseWithStatusCode>[];
};

export type EndpointReturn = {
  /**
   * Marks this operation as deprecated.
   * @returns {EndpointReturn} The endpoint return object.
   */
  deprecated: () => EndpointReturn;

  /**
   * Sets the description for this operation.
   * @param {string} description - The description text.
   * @returns {EndpointReturn} The endpoint return object.
   */
  description: (description: string) => EndpointReturn;

  /**
   * Sets external documentation for this operation.
   * @param {OpenAPIV2.ExternalDocumentationObject} externalDocs - The external documentation object.
   * @returns {EndpointReturn} The endpoint return object.
   */
  externalDocs: (externalDocs: OpenAPIV2.ExternalDocumentationObject) => EndpointReturn;

  /**
   * Adds request handlers to this operation.
   * @param {...RequestHandler} handlers - The request handlers to add.
   * @returns {EndpointReturn} The endpoint return object.
   */
  handler: (handler: RequestHandler, ...responses: ResponseWithStatusCode[]) => EndpointReturn;

  /**
   * Sets the unique string used to identify the operation. The id MUST be unique among all operations described in the API. Tools and libraries MAY use the operationId to uniquely identify an operation, therefore, it is recommended to follow common programming naming conventions.
   * @param {string} operationId - The operation ID.
   * @returns {EndpointReturn} The endpoint return object.
   */
  operationId: (operationId: string) => EndpointReturn;

  /**
   * Sets a possible response as they are returned from executing this operation for a specific status code.
   * @param {StatusCodes} statusCode - The HTTP status code.
   * @param {OpenAPIV2.ResponseObject} schema - The response schema.
   * @returns {EndpointReturn} The endpoint return object.
   */
  response: (statusCode: StatusCodes, value: ResponseObject) => EndpointReturn;

  /**
   * Sets a short summary of what the operation does. For maximum readability in the swagger-ui, this field SHOULD be less than 120 characters.
   * @param {string} summary - The summary text.
   * @returns {EndpointReturn} The endpoint return object.
   */
  summary: (summary: string) => EndpointReturn;

  /**
   * Adds tags to the list of tags for API documentation control. Tags can be used for logical grouping of operations by resources or any other qualifier.
   * @param {...string} tags - The tags to add.
   * @returns {EndpointReturn} The endpoint return object.
   */
  tags: (...tags: Array<string>) => EndpointReturn;
};
export declare type RequestSchemaType = {
  body?: ZodSchema<any>;
  query?: ZodSchema<any>;
};

export type BuildReturn = {
  routes: Route[];
};

export type SwaggerEndpoint = OpenAPIV2.OperationObject;
export type Route = SwaggerEndpoint & {
  method: HttpMethod;
  schema: RequestSchemaType;
  handlers: HandlerWithResponse[];
};

export type BoundRoute = Route & {
  path: string;
};

export type HttpMethod =
  | "post"
  | "get"
  | "put"
  | "patch"
  | "delete"
  | "options"
  | "connect"
  | "trace"
  | "head"
  | "common";
export type ValidationSchemasObject = {
  post?: RequestPostSchemaType;
  patch?: RequestPatchSchemaType;
  get?: RequestGetSchemaType;
  head?: RequestHeadSchemaType;
  options?: RequestOptionsSchemaType;
  trace?: RequestTraceSchemaType;
  put?: RequestPutSchemaType;
  connect?: RequestConnectSchemaType;
  delete?: RequestDeleteSchemaType;
};
export type MethodsStore<ValueType> = { [K in HttpMethod | undefined]?: ValueType };
export declare type RequestGetSchemaType = Omit<RequestSchemaType, "body">;
export declare type RequestDeleteSchemaType = Omit<RequestSchemaType, "body">;
export declare type RequestHeadSchemaType = Omit<RequestSchemaType, "body">;
export declare type RequestConnectSchemaType = Omit<RequestSchemaType, "body">;
export declare type RequestPostSchemaType = RequestSchemaType;
export declare type RequestPutSchemaType = RequestSchemaType;
export declare type RequestPatchSchemaType = RequestSchemaType;
export declare type RequestOptionsSchemaType = RequestSchemaType;
export declare type RequestTraceSchemaType = RequestSchemaType;
