import safeJsonStringify from "safe-json-stringify";

export function safeJson(object: any) {
  return safeJsonStringify(object || {}, (key, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }

    if (["req", "_req", "request", "_request"].includes(key)) {
      return undefined;
    }

    if (typeof value === "function") {
      return "Function";
    }

    return value;
  });
}
