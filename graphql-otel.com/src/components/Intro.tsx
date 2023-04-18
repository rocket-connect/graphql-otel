import { examplepatients } from "../images";
import { Container } from "./Container";

export function Intro() {
  return (
    <div className="py-10">
      <Container>
        <div className="flex flex-col lg:flex-row justify-between gap-40">
          <div className="text-white d-flex flex-col">
            <h1 className="text-5xl my-5 bold">GraphQL OTEL</h1>
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

          <div className="lg:w-3/6">
            <img src={examplepatients} alt="code" />
          </div>
        </div>
        <hr className="h-1 mt-20 mb-5 w-4/5 mx-auto bg-graphql-otel-green border-0" />
      </Container>
    </div>
  );
}
