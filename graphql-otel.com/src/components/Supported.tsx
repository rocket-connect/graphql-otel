import { miticon, otelicon, rocketconnect, typescripticon } from "../images";
import { Container } from "./Container";

const supported = [
  {
    name: "Compliant",
    content: "Spec compliant with all Opentelemetry tools.",
    img: otelicon,
    link: "https://opentelemetry.io/",
  },
  {
    name: "Typescript",
    content: "Written in Typescript and published to NPM.",
    img: typescripticon,
    link: "https://www.typescriptlang.org/",
  },
  {
    name: "MIT",
    content: "Open Source and hosted on Github.",
    img: miticon,
    link: "https://github.com/rocket-connect/graphql-otel",
  },
  {
    name: "Supported",
    content: "Backed and built by Rocket Connect.",
    img: rocketconnect,
    link: "https://rocketconnect.co.uk/",
  },
];

export function Supported() {
  return (
    <div className="bg-white">
      <Container>
        <div className="flex flex-col lg:flex-row justify-between gap-10 py-10">
          {supported.map((item) => (
            <div className="flex flex-col justify-center align-center text-center gap-5">
              <h3 className="font-bold">{item.name}</h3>
              <div className="w-16 mx-auto">
                <a href={item.link}>
                  <img src={item.img} alt={item.name} />
                </a>
              </div>
              <p className="text-sm italic w-3/5 mx-auto">{item.content}</p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
