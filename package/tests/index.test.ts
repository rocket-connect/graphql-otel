import * as pkg from "../src";
import { describe, test, expect } from "@jest/globals";

describe("graphql-otel", () => {
  test("should export traceDirective", () => {
    expect(pkg.traceDirective).toBeDefined();
  });

  test("should export GraphQLOTELContext", () => {
    expect(pkg.GraphQLOTELContext).toBeDefined();
  });
});
