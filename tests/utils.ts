import * as api from "@opentelemetry/api";
import { AsyncHooksContextManager } from "@opentelemetry/context-async-hooks";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Resource } from "@opentelemetry/resources";
import {
  BasicTracerProvider,
  ReadableSpan,
  SimpleSpanProcessor,
  InMemorySpanExporter,
} from "@opentelemetry/sdk-trace-base";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

export function otelSetup(
  inMemory?: boolean
): OTLPTraceExporter | InMemorySpanExporter {
  let exporter: OTLPTraceExporter | InMemorySpanExporter =
    new OTLPTraceExporter();
  if (inMemory) {
    exporter = new InMemorySpanExporter();
  }

  const contextManager = new AsyncHooksContextManager().enable();

  api.context.setGlobalContextManager(contextManager);

  const provider = new BasicTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: "graphql-otel",
      [SemanticResourceAttributes.SERVICE_VERSION]: "1.0.0",
    }),
  });

  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

  provider.register();

  return exporter;
}

export type SpanTree = {
  span: ReadableSpan;
  children: SpanTree[];
};

export function buildSpanTree(tree: SpanTree, spans: ReadableSpan[]): SpanTree {
  const childrenSpans = spans.filter(
    (span) => span.parentSpanId === tree.span.spanContext().spanId
  );

  if (childrenSpans.length) {
    tree.children = childrenSpans.map((span) =>
      buildSpanTree({ span, children: [] }, spans)
    );
  } else {
    tree.children = [];
  }

  const simpleTree = JSON.stringify(
    tree,
    (key, value) => {
      const removedKeys = [
        "endTime",
        "_ended",
        "_spanContext",
        "startTime",
        "resource",
        "_spanLimits",
        "status",
        "events",
        "instrumentationLibrary",
        "_spanProcessor",
        "_attributeValueLengthLimit",
        "_duration",
      ];

      if (removedKeys.includes(key)) {
        return undefined;
      } else {
        return value;
      }
    },
    2
  );

  return JSON.parse(simpleTree);
}
