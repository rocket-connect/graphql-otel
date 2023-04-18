import { githubwhite, logo, npmwhite } from "../images";
import { Container } from "./Container";

export function Header() {
  return (
    <div className="w-full py-5">
      <Container>
        <div className="flex justify-between">
          <div className="w-1/2">
            <div className="w-12">
              <img src={logo} alt="logo" />
            </div>
            <hr className="h-1 my-5 bg-graphql-otel-green border-0" />
          </div>

          <div className="flex gap-10 my-3">
            <div className="w-8 pt-3">
              <a href="https://www.npmjs.com/package/graphql-otel">
                <img src={npmwhite} alt="npmwhite" />
              </a>
            </div>
            <div className="w-8">
              <a href="https://github.com/rocket-connect/graphql-otel">
                <img src={githubwhite} alt="githubwhite" />
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
