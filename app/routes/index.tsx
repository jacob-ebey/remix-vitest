import type { MockedFunction } from "vitest";
import type { render as testRenderFunction } from "@testing-library/react";

import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

let DEFAULT_MESSAGE = "Hello, World!";

type LoaderData = {
  message: string;
};

export let loader: LoaderFunction = ({ request }) => {
  let url = new URL(request.url);
  let name = url.searchParams.get("name")?.trim();
  let message = DEFAULT_MESSAGE;
  if (name) {
    message = `Hello, ${name}!`;
  }

  return json<LoaderData>({
    message,
  });
};

export default function Index() {
  let { message } = useLoaderData<LoaderData>();
  return (
    <main>
      <h1>{message}</h1>
    </main>
  );
}

if (process.env.NODE_ENV === "test" && import.meta.vitest) {
  let { beforeAll, describe, test, expect, vi } = import.meta.vitest;

  let render: typeof testRenderFunction;

  beforeAll(async () => {
    let testingLibrary = await import("@testing-library/react");
    render = testingLibrary.render;
  });

  vi.mock("@remix-run/react", () => ({
    useLoaderData: vi.fn(),
  }));

  let mockedUseLoaderData = useLoaderData as MockedFunction<
    typeof useLoaderData
  >;
  describe("component", () => {
    test("renders message", () => {
      mockedUseLoaderData.mockReturnValueOnce({ message: DEFAULT_MESSAGE });
      let { getByText } = render(<Index />);
      expect(getByText(DEFAULT_MESSAGE)).toBeDefined();
    });
  });

  describe("loader", () => {
    describe("should have default message", () => {
      test("when no name is provided", async () => {
        let request = new Request("http://test.com/");
        let response = await loader({ context: {}, params: {}, request });
        expect(response.status).toBe(200);
        let data: LoaderData = await response.json();
        expect(data.message).toBe(DEFAULT_MESSAGE);
      });

      test("when name is blank string", async () => {
        let request = new Request("http://test.com/?name=  ");
        let response = await loader({ context: {}, params: {}, request });
        expect(response.status).toBe(200);
        let data: LoaderData = await response.json();
        expect(data.message).toBe(DEFAULT_MESSAGE);
      });
    });

    test("should name in message", async () => {
      let request = new Request("http://test.com/?name=  Test  ");
      let response = await loader({ context: {}, params: {}, request });
      expect(response.status).toBe(200);
      let data: LoaderData = await response.json();
      expect(data.message).toBe("Hello, Test!");
    });
  });
}
