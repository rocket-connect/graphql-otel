import { examplepatientsfail, logo } from "../images";
import { Contact } from "./Contact";
import { Container } from "./Container";

export function GettingStarted() {
  return (
    <div className="text-white py-10">
      <Container>
        <div className="flex flex-col lg:flex-row justify-between">
          <div className="flex flex-col flex-1">
            <div>
              <h2 className="text-3xl font-bold">Getting Started</h2>
              <p className="my-10">
                To get started follow to the{" "}
                <a
                  className="underline decoration-graphql-otel-green underline-offset-8"
                  href="https://github.com/rocket-connect/graphql-otel#graphql-otel"
                >
                  README file in the Github repo.
                </a>
                <ul className="text-graphql-otel-green list-outside list-disc ml-5 mt-5">
                  <li>
                    <a
                      href="https://github.com/rocket-connect/graphql-otel"
                      className="text-white italic underline decoration-graphql-otel-green underline-offset-8"
                    >
                      https://github.com/rocket-connect/graphql-otel
                    </a>
                  </li>
                </ul>
              </p>

              <div className="hidden lg:block mt-40 w-full lg:w-5/6">
                <img src={examplepatientsfail} alt="code" />
              </div>
            </div>

            <div className="hidden lg:block mx-auto w-20 mt-auto">
              <img src={logo} alt="logo" />
            </div>
          </div>

          <div>
            <hr className="h-1 mt-5 bg-graphql-otel-green border-0" />

            <div className="pt-10 text-right">
              <h2 className="text-3xl font-bold">Need More Help?</h2>

              <p className="mt-10">
                We provide specialized support for GraphQL API's.
              </p>

              <p className="mt-5">Contact us to setup a call.</p>

              <p className="mt-5">
                <a
                  href="https://rocketconnect.co.uk"
                  className="text-white italic underline decoration-graphql-otel-green underline-offset-8"
                >
                  https://rocketconnect.co.uk
                </a>
              </p>

              <div className="mt-10 flex justify-center md:justify-end mw-60">
                <Contact />
              </div>
            </div>

            <hr className="h-1 mt-10 bg-graphql-otel-green border-0" />
          </div>
        </div>
      </Container>
    </div>
  );
}
