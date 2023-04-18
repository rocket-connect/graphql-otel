import { examplepatients } from "../images";
import { Container } from "./Container";

export function Intro() {
  return (
    <div className="py-20">
      <Container>
        <div className="flex flex-col lg:flex-row justify-between gap-10">
          <div className="text-white d-flex flex-col">
            <h1 className="text-5xl mb-10 bold">GraphQL OTEL</h1>
            <p className="mb-10 italic">
              Trace your GraphQL API with OpenTelemetry.
            </p>
            <button
              onClick={() =>
                (location.href =
                  "https://github.com/rocket-connect/graphql-otel")
              }
              className="bg-white text-graphql-otel-dark hover:text-white hover:bg-graphql-otel-green font-bold py-2 px-4"
            >
              Get Started
            </button>
          </div>

          <div className="w-5/6 mx-auto lg:mx-0 lg:w-3/6 mb-10 mt-10">
            <img src={examplepatients} alt="code" />
          </div>
        </div>
        <hr className="h-1 mt-10 w-4/5 mx-auto bg-graphql-otel-green border-0" />
      </Container>
    </div>
  );
}
