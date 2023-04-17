export function Contact() {
  return (
    <form className="p-0 m-0" onSubmit={() => {}}>
      <div className="flex flex-col gap-10 text-graphql-otel-dark">
        <input
          className="bg-white p-3 w-96 h-12 placeholder-graphql-otel-dark"
          type="name"
          name="name"
          id="name"
          placeholder="Name"
          disabled={true}
          required={true}
        />

        <input
          className="bg-white p-3 w-96 h-12 placeholder-graphql-otel-dark"
          type="email"
          name="email"
          placeholder="Email"
          id="email"
          disabled={true}
          required={true}
        />
        <textarea
          className="bg-white p-3 w-96 h-32 placeholder-graphql-otel-dark"
          name="message"
          placeholder="I would like help tracing my GraphQL API."
          id="message"
          disabled={true}
          required={true}
        />

        <button
          type="submit"
          disabled={true}
          className="ml-auto italic bg-white p-3 submit w-3/6 py-2 underline decoration-graphql-otel-green underline-offset-8"
        >
          Send
        </button>
      </div>
    </form>
  );
}
