import { OpenAPIV2 } from "openapi-types";
import {
  BuildReturn,
  EndpointReturn,
  HandlerWithResponse,
  HttpMethod,
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
  Route,
  ValidationSchemasObject,
} from "./types";
import { RouteField, routeFields } from "./router";

/**
 * Represents an endpoint with different HTTP method handlers.
 */
export class Endpoint {

  private deprecated: MethodsStore<boolean> = {};
  private description: MethodsStore<string> = {};
  private externalDocs: MethodsStore<OpenAPIV2.ExternalDocumentationObject> = {};
  private handlers: MethodsStore<HandlerWithResponse[]> = {};
  private operationId: MethodsStore<string> = {};
  private responses: MethodsStore<Record<string, OpenAPIV2.ResponseObject>> = {};
  private schema: ValidationSchemasObject = {};
  private summary: MethodsStore<string> = {};
  private tags: MethodsStore<Array<string>> = {};

  private endpointReturn: Record<HttpMethod, EndpointReturn> = Object.fromEntries(
    ["post", "patch", "get", "head", "options", "trace", "put", "connect", "delete"].map((verb) => [
      verb,
      this.endpointCtor(verb as HttpMethod),
    ])
  ) as Record<HttpMethod, EndpointReturn>;

  constructor(...handlers: HandlerWithResponse[]) {
    this.handlers.common = handlers;
  }

  /**
   * Sets the schema for the HEAD method and returns the handler constructor.
   * @param schema - The request schema for validation.
   * @returns The endpoint builder constructor.
   */
  head(schema?: RequestHeadSchemaType) {
    this.schema.get = schema;
    return this.endpointReturn.head;
  }

  /**
   * Sets the schema for the POST method and returns the handler constructor.
   * @param schema - The request schema for validation.
   * @returns The endpoint builder constructor.
   */
  post(schema?: RequestPostSchemaType) {
    this.schema.post = schema;
    return this.endpointReturn.post;
  }

  /**
   * Sets the schema for the GET method and returns the handler constructor.
   * @param schema - The request schema for validation.
   * @returns The endpoint builder constructor.
   */
  get(schema?: RequestGetSchemaType) {
    this.schema.get = schema;
    return this.endpointReturn.get;
  }

  /**
   * Sets the schema for the PUT method and returns the handler constructor.
   * @param schema - The request schema for validation.
   * @returns The endpoint builder constructor.
   */
  put(schema?: RequestPutSchemaType) {
    this.schema.put = schema;
    return this.endpointReturn.put;
  }

  /**
   * Sets the schema for the PATCH method and returns the handler constructor.
   * @param schema - The request schema for validation.
   * @returns The endpoint builder constructor.
   */
  patch(schema?: RequestPatchSchemaType) {
    this.schema.patch = schema;
    return this.endpointReturn.patch;
  }

  /**
   * Sets the schema for the DELETE method and returns the handler constructor.
   * @param schema - The request schema for validation.
   * @returns The endpoint builder constructor.
   */
  delete(schema?: RequestDeleteSchemaType) {
    this.schema.delete = schema;
    return this.endpointReturn.delete;
  }

  /**
   * Sets the schema for the OPTIONS method and returns the handler constructor.
   * @param schema - The request schema for validation.
   * @returns The endpoint builder constructor.
   */
  options(schema?: RequestOptionsSchemaType) {
    this.schema.options = schema;
    return this.endpointReturn.options;
  }

  /**
   * Sets the schema for the CONNECT method and returns the handler constructor.
   * @param schema - The request schema for validation.
   * @returns The endpoint builder constructor.
   */
  connect(schema?: RequestConnectSchemaType) {
    this.schema.connect = schema;
    return this.endpointReturn.connect;
  }

  /**
   * Sets the schema for the TRACE method and returns the handler constructor.
   * @param schema - The request schema for validation.
   * @returns The endpoint builder constructor.
   */
  trace(schema?: RequestTraceSchemaType) {
    this.schema.trace = schema;
    return this.endpointReturn.trace;
  }

  private endpointCtor(method: HttpMethod): EndpointReturn {
    const response: EndpointReturn["response"] = (statusCode, value) => {
      this.responses[method] = this.responses[method] || {};
      this.responses[method][String(statusCode)] = value as OpenAPIV2.ResponseObject;
      return this.endpointReturn[method];
    };
    const deprecated: EndpointReturn["deprecated"] = () => {
      this.deprecated[method] = true;
      return this.endpointReturn[method];
    };
    const externalDocs: EndpointReturn["externalDocs"] = (externalDocs) => {
      this.externalDocs[method] = externalDocs;
      return this.endpointReturn[method];
    };
    const summary: EndpointReturn["summary"] = (summary) => {
      this.summary[method] = summary;
      return this.endpointReturn[method];
    };
    const operationId: EndpointReturn["operationId"] = (operationId) => {
      this.operationId[method] = operationId;
      return this.endpointReturn[method];
    };
    const description: EndpointReturn["description"] = (description) => {
      this.description[method] = description;
      return this.endpointReturn[method];
    };
    const tags: EndpointReturn["tags"] = (...tags) => {
      this.tags[method] = this.tags[method] || [];
      this.tags[method].push(...tags);
      return this.endpointReturn[method];
    };
    const handler: EndpointReturn["handler"] = (handler, ...responses) => {
      this.handlers[method] = this.handlers[method] || [];
      this.handlers[method].push({ handler, responses });
      return this.endpointReturn[method];
    };
    return { response, deprecated, externalDocs, summary, operationId, description, tags, handler };
  }

  /**
   * Builds the endpoint by organizing the handlers and routes.
   * @returns The built endpoint object.
   */
  private _build() {
    const returnValue: BuildReturn = {
      routes: [],
    };

    Object.entries(this.handlers).forEach(([method, value]) => {
      if (method === "common" || value.length === 0) return;

      const settledFields = routeFields.reduce((prev, curr) => {
        prev[curr] = this[curr][method];
        return prev;
      }, {} as Record<RouteField, any>);

      const newRoute: Route = {
        method: method as HttpMethod,
        handlers: [...this.handlers.common, ...this.handlers[method]],
        ...settledFields,
      };
      returnValue.routes.push(newRoute);
    });

    return returnValue;
  }
}
