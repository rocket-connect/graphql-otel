import { useCallback, useState } from "react";
import { API_URL } from "../config";

export async function signup(body: {
  name: string;
  email: string;
  message: string;
}) {
  const response = await fetch(`${API_URL}/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (response.status !== 200 || !response.ok) {
    throw new Error(await response.text());
  }
}

export function Contact() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const send = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);

      try {
        const body = {
          // @ts-ignore
          email: e.target.elements.email.value as string,
          // @ts-ignore
          name: e.target.elements.name.value as string,
          // @ts-ignore
          message: e.target.elements.message.value as string,
        };

        await signup(body);
        setSent(true);
      } catch (error) {
        const e = error as Error;
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
    [setError, setLoading]
  );

  if (error) {
    return <></>;
  }

  return (
    <form className="p-0 m-0" onSubmit={send}>
      <div className="flex flex-col gap-10 text-graphql-otel-dark">
        <input
          className="bg-white p-3 w-96 h-12 placeholder-graphql-otel-dark"
          type="name"
          name="name"
          id="name"
          placeholder="Name"
          disabled={Boolean(loading || sent || error)}
          required={true}
        />

        <input
          className="bg-white p-3 w-96 h-12 placeholder-graphql-otel-dark"
          type="email"
          name="email"
          placeholder="Email"
          id="email"
          disabled={Boolean(loading || sent || error)}
          required={true}
        />
        <textarea
          className="bg-white p-3 w-96 h-32 placeholder-graphql-otel-dark"
          name="message"
          placeholder="I would like help tracing my GraphQL API."
          id="message"
          disabled={Boolean(loading || sent || error)}
          required={true}
        />

        <button
          type="submit"
          disabled={Boolean(loading || sent || error)}
          className="ml-auto italic bg-white p-3 submit w-3/6 py-2 underline decoration-graphql-otel-green underline-offset-8"
        >
          Send
        </button>
      </div>
    </form>
  );
}
