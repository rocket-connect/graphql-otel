import {
  Context,
  trace,
  Tracer,
  context as otelContext,
} from "@opentelemetry/api";
import { Span } from "@opentelemetry/sdk-trace-base";
import { runInSpan } from "./run-in-span";
import { GraphQLSchema, lexicographicSortSchema } from "graphql";
import { printSchemaWithDirectives } from "@graphql-tools/utils";
import crypto from "crypto";

export interface GraphQLOTELContextOptions {
  /* If true will add the context in the span attributes */
  includeContext?: boolean;
  /* If true will add the variables in the span attributes */
  includeVariables?: boolean;
  /* If true will add the result in the span attributes */
  includeResult?: boolean;
  /* List of strings to exclude from the context, for example auth */
  excludeKeysFromContext?: string[];
}

export class GraphQLOTELContext {
  private context?: Context;
  public tracer: Tracer;
  private rootSpan?: Span;
  public includeContext?: boolean;
  public includeVariables?: boolean;
  public includeResult?: boolean;
  public excludeKeysFromContext?: string[];
  public schema?: GraphQLSchema;
  public schemaHash?: string;

  constructor(options: GraphQLOTELContextOptions = {}) {
    this.includeContext = options.includeContext;
    this.includeVariables = options.includeVariables;
    this.excludeKeysFromContext = options.excludeKeysFromContext;
    this.includeResult = options.includeResult;
    this.tracer = trace.getTracer("graphql-otel");
  }

  setContext(ctx: Context) {
    this.context = ctx;
  }

  getContext(): Context | undefined {
    return this.context;
  }

  setRootSpan(span: Span) {
    this.rootSpan = span;
  }

  getRootSpan(): Span | undefined {
    return this.rootSpan;
  }

  public setSchema(schema: GraphQLSchema) {
    const sorted = lexicographicSortSchema(schema);
    const printed = printSchemaWithDirectives(sorted);

    const hash = crypto.createHash("sha256");
    hash.update(printed);

    this.schemaHash = hash.digest("hex");
    this.schema = schema;
  }

  runInChildSpan(input: {
    name: string;
    cb: () => unknown;
    graphqlContext: any;
  }): unknown {
    const internalCtx = input.graphqlContext
      .GraphQLOTELContext as GraphQLOTELContext;

    if (!internalCtx) {
      throw new Error("contextValue.GraphQLOTELContext missing");
    }

    const parentContext = internalCtx ? internalCtx.getContext() : undefined;

    const traceCTX: Context = parentContext || otelContext.active();
    internalCtx.setContext(traceCTX);

    const currentSpan = input.graphqlContext.currentSpan as Span | undefined;

    return runInSpan(
      {
        name: input.name,
        context: traceCTX,
        tracer: internalCtx.tracer,
        parentSpan: currentSpan,
      },
      input.cb
    );
  }
}
