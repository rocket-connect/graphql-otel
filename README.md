# GraphQL OTEL

[![Test](https://github.com/rocket-connect/graphql-otel/actions/workflows/push.yml/badge.svg)](https://github.com/rocket-connect/graphql-otel/actions/workflows/push.yml) [![npm version](https://badge.fury.io/js/graphql-otel.svg)](https://badge.fury.io/js/graphql-otel) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Opentelemetry GraphQL Schema Directive.

- [https://graphql-otel.com](https://graphql-otel.com)
- [https://github.com/rocket-connect/graphql-otel](https://github.com/rocket-connect/graphql-otel)
- [https://www.npmjs.com/package/graphql-otel](https://www.npmjs.com/package/graphql-otel)

## How it works

Place the `@trace` directive on any fields you wish to trace.

```graphql
type User {
  name: String
  age: Int
  balance: Int @trace
  posts: [Post] @trace
}

type Post {
  title: String
  comments: [Comment] @trace
}

type Comment {
  content: String
}
```

Given the query:

```graphql
query {
  users {
    name
    balance
    posts {
      title
      comments {
        content
      }
    }
  }
}
```

Outputting the following traces:

![Traces](https://user-images.githubusercontent.com/35999252/195374980-20c94be1-2836-4460-91b3-e4c1f0f2acbb.png)

## Getting Started

### Running Jaeger UI

- https://www.jaegertracing.io/

This is an open-source collector, and it comes with a graphical interface. You collect the traces and spans from your GraphQL server and send export them to here. Then, once they are sent, you can visualize them like the image above.

To start this interface, I suggest you use Docker. Here is an all-in-one script to start jager.

```
docker run --rm --name jaeger \
  -e COLLECTOR_ZIPKIN_HOST_PORT=:9411 \
  -e COLLECTOR_OTLP_ENABLED=true \
  -p 6831:6831/udp \
  -p 6832:6832/udp \
  -p 5778:5778 \
  -p 16686:16686 \
  -p 4317:4317 \
  -p 4318:4318 \
  -p 14250:14250 \
  -p 14268:14268 \
  -p 14269:14269 \
  -p 9411:9411 \
  jaegertracing/all-in-one:1.35
```

Then you can go to http://localhost:16686/ to open the UI.

### Boilerplate

Quickstart boilerplate.

<details closed>
<summary>setup-otel.ts</summary>

<br>

```ts
import * as api from "@opentelemetry/api";
import { AsyncHooksContextManager } from "@opentelemetry/context-async-hooks";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Resource } from "@opentelemetry/resources";
import {
  BasicTracerProvider,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

export function setupOtel() {
  const contextManager = new AsyncHooksContextManager().enable();

  api.context.setGlobalContextManager(contextManager);

  const otlpTraceExporter = new OTLPTraceExporter();

  const provider = new BasicTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: "graphql-otel",
      [SemanticResourceAttributes.SERVICE_VERSION]: "1.0.0",
    }),
  });

  provider.addSpanProcessor(new SimpleSpanProcessor(otlpTraceExporter));

  provider.register();
}
```

</details>

index.ts:

```ts
import { setupOtel } from "./setup-otel";
setupOtel();

import { makeExecutableSchema } from "@graphql-tools/schema";
import { traceDirective, GraphQLOTELContext } from "graphql-otel";
import { createServer } from "@graphql-yoga/node";
import util from "util";
const sleep = util.promisify(setTimeout);

const typeDefs = `
    type User {
      name: String
      age: Int
      balance: Int @trace
      posts: [Post] @trace
    }

    type Post {
      title: String
      comments: [Comment] @trace
    }

    type Comment {
      content: String
    }

    type Query {
      users: [User] @trace
    }
`;

const resolvers = {
  Query: {
    users: async () => {
      await sleep(200);
      return [{ name: "Dan", age: 23 }];
    },
  },
  User: {
    balance: async () => {
      await sleep(100);
      return 100;
    },
    posts: async () => {
      await sleep(500);
      return [{ title: "Beer Is Cool" }];
    },
  },
  Post: {
    comments: async () => {
      await sleep(300);
      return [
        {
          content: "I also think beer is cool",
        },
      ];
    },
  },
};

const trace = traceDirective();

let schema = makeExecutableSchema({
  typeDefs: [typeDefs, trace.typeDefs],
  resolvers,
});

schema = trace.transformer(schema);

const server = createServer({
  schema,
  port: 5000,
  context: {
    GraphQLOTELContext: new GraphQLOTELContext(),
  },
});

server
  .start()
  .then(() => console.log("server online"))
  .catch(console.error);
```

### Context Value

Inject the `GraphQLOTELContext` instance inside your GraphQL request context.

```js
import { GraphQLOTELContext } from "graphql-otel";

const myServer = new GraphQLServerFooBar({
  schema,
  context: {
    GraphQLOTELContext: new GraphQLOTELContext(),
  },
});
```

#### Exporting traces

This package does not export traces to your collector, you must set this up yourself. Checkout the quickstart boilerplate `setup-otel` file in this document.

## Resources

- https://www.jaegertracing.io/
- https://opentelemetry.io/
- https://www.the-guild.dev/graphql/tools/docs/schema-directives

## Licence

MIT Rocket Connect - www.rocketconnect.co.uk
