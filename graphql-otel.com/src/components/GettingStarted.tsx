import { logo } from "../images";
import { Contact } from "./Contact";
import { Container } from "./Container";
import { Example } from "./Example";

export function GettingStarted() {
  return (
    <div className="text-white py-20">
      <Container>
        <div className="flex justify-between">
          <div className="flex flex-col">
            <div>
              <h2 className="text-4xl">Getting Started</h2>
              <p className="my-10 italic">
                To get started follow to the{" "}
                <a
                  className="italic underline decoration-graphql-otel-green underline-offset-8"
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
            </div>

            <div className="mt-20">
              <Example />
            </div>

            <div className="mx-auto w-20 mt-auto">
              <img src={logo} alt="logo" />
            </div>
          </div>

          <div>
            <hr className="h-1 my-5 bg-graphql-otel-green border-0" />

            <div className="pt-20 text-right">
              <h2 className="text-4xl">Need More Help?</h2>

              <p className="mt-10 italic">
                We provide specialized support for GraphQL API's.
              </p>

              <p className="mt-5 italic">Contact us to setup a call.</p>

              <p className="mt-5">
                <a
                  href="https://rocketconnect.co.uk"
                  className="text-white italic underline decoration-graphql-otel-green underline-offset-8"
                >
                  https://rocketconnect.co.uk
                </a>
              </p>

              <div className="mt-10 flex justify-end">
                <Contact />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
