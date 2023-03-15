import {
  InMemorySpanExporter,
  ReadableSpan,
} from "@opentelemetry/sdk-trace-base";

import { otelSetup, buildSpanTree } from "./utils";
const inMemorySpanExporter = otelSetup(true) as InMemorySpanExporter;

import { makeExecutableSchema } from "@graphql-tools/schema";
import { traceDirective } from "../src";
import { graphql, parse, print } from "graphql";
import { GraphQLOTELContext } from "../src/context";

const util = require("util");
const sleep = util.promisify(setTimeout);

describe("@trace directive", () => {
  beforeEach(() => {
    inMemorySpanExporter.reset();
  });

  test("should throw an error if context is not set", async () => {
    const typeDefs = `
      type User {
        name: String @trace
      }

      type Query {
        users: [User] @trace
      }
    `;

    const resolvers = {
      Query: {
        users: () => {
          return [{ name: "Dan" }];
        },
      },
    };

    const trace = traceDirective();

    let schema = makeExecutableSchema({
      typeDefs: [typeDefs, trace.typeDefs],
      resolvers,
    });

    schema = trace.transformer(schema);

    const query = `
      query {
        users {
          name
        }
      }
    `;

    const { errors } = await graphql({
      schema,
      source: query,
      contextValue: {
        // GraphQLOTELContext: new GraphQLOTELContext(),
      },
    });

    const error = ((errors || [])[0] as unknown as Error).message;

    expect(error).toContain("contextValue.GraphQLOTELContext missing");
  });

  test("should trace a query", async () => {
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
          // Simulate time
          await sleep(200);

          return [{ name: "Dan", age: 23 }];
        },
      },
      User: {
        balance: async () => {
          // Simulate complex lookup
          await sleep(100);

          return 100;
        },
        posts: async () => {
          // Simulate a join
          await sleep(500);
          return [{ title: "Cake Is Cool" }];
        },
      },
      Post: {
        comments: async (
          source,
          args,
          context: { GraphQLOTELContext: GraphQLOTELContext }
        ) => {
          const childSpanInput = {
            name: "test-child-span",
            cb: async () => {
              await sleep(300);
            },
            graphqlContext: context,
          };

          await context.GraphQLOTELContext.runInChildSpan(childSpanInput);

          // Simulate a join
          await sleep(300);

          return [
            {
              content: "I also think cake is cool",
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

    const query = `
      query {
        users {
          name
          age
          balance
          posts {
            title
            comments {
              content
            }
          }
        }
      }
    `;

    const { errors } = await graphql({
      schema,
      source: query,
      contextValue: {
        GraphQLOTELContext: new GraphQLOTELContext(),
      },
    });

    expect(errors).toBeUndefined();

    const spans = inMemorySpanExporter.getFinishedSpans();
    const rootSpan = spans.find((span) => !span.parentSpanId) as ReadableSpan;
    const spanTree = buildSpanTree({ span: rootSpan, children: [] }, spans);

    expect(spanTree.span.name).toEqual("Query:users");
    expect(spanTree.span.attributes.query).toMatch(print(parse(query)));

    const balanceSpan = spanTree.children.find(
      (child) => child.span.name === "User:balance"
    );
    expect(balanceSpan).toBeDefined();

    const postsSpan = spanTree.children.find(
      (child) => child.span.name === "User:posts"
    );
    expect(postsSpan).toBeDefined();

    const commentsSnap = postsSpan!.children.find(
      (child) => child.span.name === "Post:comments"
    );
    expect(commentsSnap).toBeDefined();

    const testChildSpan = commentsSnap!.children.find(
      (child) => child.span.name === "test-child-span"
    );
    expect(testChildSpan).toBeDefined();
    // @ts-ignore
    expect(commentsSnap!.span._spanContext.spanId).toEqual(
      testChildSpan!.span.parentSpanId
    );
  });

  test("should trace a mutation", async () => {
    const typeDefs = `
        type User {
          name: String
          age: Int
          posts: [Post] @trace
        }

        type Post {
          title: String
        }

        type Mutation {
          createUser(name: String, age: Int): User @trace
        }

        type Query {
          _root_type_must_be_provided: User
        }
    `;

    const resolvers = {
      Mutation: {
        createUser: (_: any, args: { name: string; age: number }) => {
          return [
            {
              name: args.name,
              age: args.age,
              posts: [{ title: "Beer Is Cool" }],
            },
          ];
        },
      },
      Query: {
        _root_type_must_be_provided: () => ({ name: "Dan", age: 23 }),
      },
    };

    const trace = traceDirective();

    let schema = makeExecutableSchema({
      typeDefs: [typeDefs, trace.typeDefs],
      resolvers,
    });

    schema = trace.transformer(schema);

    const query = `
      mutation {
        createUser(name: "Dan", age: 23) {
          name
          age
          posts {
            title
          }
        }
      }
    `;

    const { errors } = await graphql({
      schema,
      source: query,
      contextValue: {
        GraphQLOTELContext: new GraphQLOTELContext(),
      },
    });

    expect(errors).toBeUndefined();

    const spans = inMemorySpanExporter.getFinishedSpans();
    const rootSpan = spans.find((span) => !span.parentSpanId) as ReadableSpan;
    const spanTree = buildSpanTree({ span: rootSpan, children: [] }, spans);

    expect(spanTree.span.name).toEqual("Mutation:createUser");
    expect(spanTree.span.attributes.query).toMatch(print(parse(query)));

    const postsSpan = spanTree.children.find(
      (child) => child.span.name === "User:posts"
    );
    expect(postsSpan).toBeDefined();
  });

  test("should append graphql error to trace", async () => {
    const randomString = Math.random().toString(36).substring(7);

    const typeDefs = `
      type User {
        name: String
        age: Int
      }

      type Query {
        users: [User] @trace
      }
    `;

    const resolvers = {
      Query: {
        users: async () => {
          throw new Error(randomString);
        },
      },
    };

    const trace = traceDirective();

    let schema = makeExecutableSchema({
      typeDefs: [typeDefs, trace.typeDefs],
      resolvers,
    });

    schema = trace.transformer(schema);

    const query = `
      query {
        users {
          name
          age
        }
      }
    `;

    const { errors } = await graphql({
      schema,
      source: query,
      contextValue: {
        GraphQLOTELContext: new GraphQLOTELContext(),
      },
    });

    expect(errors).toBeDefined();

    const spans = inMemorySpanExporter.getFinishedSpans();
    const rootSpan = spans.find((span) => !span.parentSpanId) as ReadableSpan;
    const spanTree = buildSpanTree({ span: rootSpan, children: [] }, spans);

    expect(spanTree.span.name).toEqual("Query:users");
    expect(spanTree.span.attributes.query).toMatch(print(parse(query)));

    const events = spanTree.span.events;

    const errorEvent = events.find(
      (e) => (e.attributes as any)["exception.message"] === randomString
    );

    expect(errorEvent).toBeDefined();
  });
});
