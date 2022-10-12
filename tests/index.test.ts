import * as pkg from "../src";

describe("graphql-otel", () => {
  test("should export traceDirective", () => {
    expect(pkg.traceDirective).toBeDefined();
  });
});
