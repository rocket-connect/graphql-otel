import { otelSetup } from "./setup-otel";

import { makeExecutableSchema } from "@graphql-tools/schema";
import { traceDirective } from "../src";
import { graphql } from "graphql";
import { GraphQLOTELContext } from "../src/context";

const util = require("util");
const sleep = util.promisify(setTimeout);

describe("@trace directive", () => {
  beforeAll(() => {
    otelSetup();
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
        comments: async () => {
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

    const res = await graphql({
      schema,
      source: query,
      contextValue: {
        graphQLOTELContext: new GraphQLOTELContext(),
      },
    });

    console.log(res);
  });

  test("should trace a mutation", async () => {
    const typeDefs = `
        type User {
            name: String @trace
            age: Int
            posts: [Post] @trace
        }

        type Post {
          title: String
        }

        type Mutation {
            createUser(name: String, age: Int): [User] @trace
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

    const res = await graphql({
      schema,
      source: query,
      contextValue: {
        graphQLOTELContext: new GraphQLOTELContext(),
      },
    });

    console.log(res);
  });
});
