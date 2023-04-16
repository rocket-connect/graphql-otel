import {
  Context,
  trace,
  Tracer,
  context as otelContext,
} from "@opentelemetry/api";
import { Span } from "@opentelemetry/sdk-trace-base";
import { runInSpan } from "./run-in-span";

export interface GraphQLOTELContextOptions {
  includeContext?: boolean;
  includeVariables?: boolean;
  excludeKeysFromContext?: string[];
}

export class GraphQLOTELContext {
  private context?: Context;
  public tracer: Tracer;
  private rootSpan?: Span;
  public includeContext?: boolean;
  public includeVariables?: boolean;
  public excludeKeysFromContext?: string[];

  constructor(options: GraphQLOTELContextOptions = {}) {
    this.includeContext = options.includeContext;
    this.includeVariables = options.includeVariables;
    this.excludeKeysFromContext = options.excludeKeysFromContext;
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
