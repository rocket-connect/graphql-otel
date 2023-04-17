import { githubwhite, logo } from "../images";
import { Container } from "./Container";

export function Header() {
  return (
    <div className="w-full py-3">
      <Container>
        <div className="flex justify-between content-center">
          <div className="w-1/2">
            <div className="w-16">
              <img src={logo} alt="logo" />
            </div>
            <hr className="h-1 my-8 bg-graphql-otel-green border-0" />
          </div>

          <div className="flex gap-10 my-5">
            <div className="w-8">
              <img src={githubwhite} alt="githubwhite" />
            </div>
            <div className="w-8">
              <img src={githubwhite} alt="githubwhite" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
