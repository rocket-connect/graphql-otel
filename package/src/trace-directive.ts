import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";
import { context as otelContext, Context } from "@opentelemetry/api";
import { GraphQLSchema, defaultFieldResolver, print } from "graphql";
import { GraphQLOTELContext } from "./context";
import { Span } from "@opentelemetry/sdk-trace-base";
import { runInSpan } from "./run-in-span";
import safeJSON from "safe-json-stringify";

export function traceDirective(directiveName = "trace") {
  return {
    typeDefs: `directive @${directiveName} on FIELD_DEFINITION`,
    transformer: (schema: GraphQLSchema) => {
      return mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
          const traceDirective = getDirective(
            schema,
            fieldConfig,
            directiveName
          )?.[0];

          if (!traceDirective) {
            return;
          }

          const { resolve = defaultFieldResolver } = fieldConfig;

          return {
            ...fieldConfig,
            resolve: async function (source, args, context, info) {
              const internalCtx =
                context.GraphQLOTELContext as GraphQLOTELContext;

              if (!internalCtx) {
                throw new Error("contextValue.GraphQLOTELContext missing");
              }

              const parentContext = internalCtx
                ? internalCtx.getContext()
                : undefined;

              const traceCTX: Context = parentContext || otelContext.active();
              internalCtx.setContext(traceCTX);

              const parentSpan = context.parentSpan as Span | undefined;

              const isRoot = ["Query", "Mutation"].includes(
                info.parentType.name
              );

              const name = `${info.parentType.name}:${fieldConfig.astNode?.name.value}`;

              const attributeContext = {
                ...context,
                GraphQLOTELContext: undefined,
              };

              if (internalCtx?.excludeKeysFromContext?.length) {
                Object.keys(attributeContext).forEach((key) => {
                  if (internalCtx?.excludeKeysFromContext?.includes(key)) {
                    delete attributeContext[key];
                  }
                });
              }

              const result = await runInSpan(
                {
                  name,
                  context: traceCTX,
                  tracer: internalCtx.tracer,
                  parentSpan,
                  ...(isRoot
                    ? {
                        attributes: {
                          query: print(info.operation),
                          ...(internalCtx.includeVariables
                            ? { variables: safeJSON(args) }
                            : {}),
                          ...(internalCtx.includeContext
                            ? {
                                context: safeJSON(attributeContext),
                              }
                            : {}),
                        },
                      }
                    : {}),
                },
                async (span) => {
                  if (!internalCtx.getRootSpan()) {
                    internalCtx.setRootSpan(span);
                  }

                  context.currentSpan = span;

                  const result = await resolve(source, args, context, info);

                  if (internalCtx.includeResult) {
                    if (
                      typeof result === "number" ||
                      typeof result === "string" ||
                      typeof result === "boolean"
                    ) {
                      span.setAttribute("result", result);
                    } else if (typeof result === "object") {
                      span.setAttribute("result", safeJSON(result || {}));
                    }
                  }

                  context.parentSpan = span;

                  return result;
                }
              );

              return result;
            },
          };
        },
      });
    },
  };
}
