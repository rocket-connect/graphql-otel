import safeJsonStringify from "safe-json-stringify";

export function safeJson(object: any) {
  return safeJsonStringify(object || {}, (key, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    } else {
      return value;
    }
  });
}
