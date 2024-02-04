import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodSchema } from "zod";
import { OpenAPIV2 } from "openapi-types";
import { JsonSchema7Type } from "zod-to-json-schema/src/parseDef";
import { routeFields } from "./router";

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


export declare type RequestSchemaType = {
  body?: ZodSchema<any>;
  query?: ZodSchema<any>;
};

export type BuildReturn = Route[];

export type SwaggerEndpoint = OpenAPIV2.OperationObject;
export type Route = SwaggerEndpoint & {
  path?: string;
  method: HttpMethod;
  schema: RequestSchemaType;
  handlers: RequestHandler[];
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

export type AnyValidationSchema = RequestSchemaType;

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

export type RouteField = (typeof routeFields)[number];
