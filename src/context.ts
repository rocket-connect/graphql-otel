import { Context, trace, Tracer } from "@opentelemetry/api";
import { Span } from "@opentelemetry/sdk-trace-base";

export class GraphQLOTELContext {
  private context?: Context;
  public tracer: Tracer;
  private rootSpan?: Span;

  constructor() {
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
}
