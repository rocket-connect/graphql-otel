import { code, rocketconnect } from "../images";
import { Container } from "./Container";

export function Intro() {
  return (
    <div className="py-10">
      <Container>
        <div className="flex justify-between gap-40">
          <div className="text-white d-flex flex-col">
            <h1 className="text-5xl my-10 bold">GraphQL OTEL</h1>
            <p className="text-2xl mb-10 italic">
              Trace your GraphQL API with OpenTelemetry.
            </p>
            <button className="bg-white text-graphql-otel-dark hover:text-white hover:bg-graphql-otel-green text-white font-bold py-2 px-4 rounded">
              Get Started
            </button>
          </div>

          <div className="flex flex-1 justify-between my-10">
            <div className="w-32 pt-12">
              <img src={code} alt="code" />
            </div>

            <div className="text-xs italic flex flex-col my-auto">
              <div>
                <div className="text-white flex my-5 justify-between">
                  <p>query patients()</p>
                  <p>400ms</p>
                </div>
                <hr className="h-1 mb-10 w-80 bg-graphql-otel-green border-0" />
              </div>

              <div className="mr-20">
                <div className="text-white my-5">
                  <p>patient.documents() 200ms</p>
                </div>
                <hr className="h-1 mb-10 w-40 bg-graphql-otel-green border-0 ml-auto" />
              </div>

              <div className="">
                <div className="text-white my-5 ">
                  <p>document.images() 100ms</p>
                </div>
                <hr className="h-1 mb-10 w-20 bg-graphql-otel-green border-0 ml-auto" />
              </div>
            </div>
          </div>
        </div>
        <hr className="h-1 mt-40 mb-5 w-4/5 mx-auto bg-graphql-otel-green border-0" />
      </Container>
    </div>
  );
}
