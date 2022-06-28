import * as RTL from "@testing-library/react";
import * as Mocks from "~/mocks";

import * as RemixServer from "@remix-run/node";
import * as RemixReact from "@remix-run/react";

let DEFAULT_MESSAGE = "Hello, World!";

type LoaderData = {
  message: string;
};

export let loader: RemixServer.LoaderFunction = ({ request }) => {
  let url = new URL(request.url);
  let name = url.searchParams.get("name")?.trim();
  let message = DEFAULT_MESSAGE;
  if (name) {
    message = `Hello, ${name}!`;
  }

  return RemixServer.json<LoaderData>({
    message,
  });
};

export default function Index() {
  let { message } = RemixReact.useLoaderData<LoaderData>();
  return (
    <main>
      <h1>{message}</h1>
      <p>
        <RemixReact.Link to="about">Go to the about page.</RemixReact.Link>
      </p>
    </main>
  );
}

if (process.env.NODE_ENV === "test" && import.meta.vitest) {
  let { describe, test, expect, vi } = import.meta.vitest;

  vi.mock("@remix-run/react", () => Mocks.createRemixReactMock({ path: "/" }));
  let MockRemixReact = RemixReact as unknown as ReturnType<
    typeof Mocks.createRemixReactMock
  >;

  describe("component", () => {
    test("renders message", () => {
      MockRemixReact.useLoaderData.mockReturnValueOnce({
        message: DEFAULT_MESSAGE,
      });
      let { getByText } = RTL.render(<Index />);
      expect(getByText(DEFAULT_MESSAGE)).toBeDefined();
    });

    test("renders link to about", () => {
      MockRemixReact.useLoaderData.mockReturnValueOnce({
        message: DEFAULT_MESSAGE,
      });
      let { getByRole } = RTL.render(<Index />);
      expect(getByRole("link").getAttribute("href")).toBe("/about");
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
