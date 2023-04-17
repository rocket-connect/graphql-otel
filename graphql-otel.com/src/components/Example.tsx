import { code } from "../images";

export function Example() {
  return (
    <div className="flex justify-between gap-20">
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

        <div>
          <div className="text-white my-5 ">
            <p>document.images() 100ms</p>
          </div>
          <hr className="h-1 mb-10 w-20 bg-graphql-otel-green border-0 ml-auto" />
        </div>
      </div>
    </div>
  );
}
