import { Container } from "./Container";

export function Footer() {
  return (
    <footer>
      <div className="bg-white w-full">
        <Container>
          <div className="flex justify-center py-3 bold">
            <p>
              <a
                href="https://github.com/rocket-connect/graphql-otel"
                className="text-graphql-otel-dark italic underline decoration-graphql-otel-green underline-offset-8"
              >
                GraphQL OTEL MIT
              </a>
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
