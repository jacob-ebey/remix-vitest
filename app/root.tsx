import * as RTL from "@testing-library/react";
import * as Mocks from "~/mocks";

import type * as RemixNode from "@remix-run/node";
import * as RemixReact from "@remix-run/react";

export const meta: RemixNode.MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export default function Root() {
  return (
    <html lang="en">
      <head>
        <RemixReact.Meta />
        <RemixReact.Links />
      </head>
      <body>
        <RemixReact.Outlet />
        <RemixReact.ScrollRestoration />
        <RemixReact.Scripts />
        <RemixReact.LiveReload />
      </body>
    </html>
  );
}

if (process.env.NODE_ENV === "test" && import.meta.vitest) {
  let { describe, test, expect, vi } = import.meta.vitest;

  vi.mock("@remix-run/react", () =>
    Mocks.createRemixReactMock({
      path: "/",
      Outlet: () => <div data-testid="outlet" />,
    })
  );

  describe("meta", () => {
    test("contains charset, title, and viewport", () => {
      let data = meta({
        data: {},
        location: {
          hash: "",
          pathname: "/",
          key: "",
          search: "",
          state: undefined,
        },
        params: {},
        parentsData: {},
      });

      expect(data.charset).toBeTypeOf("string");
      expect(data.title).toBeTypeOf("string");
      expect(data.viewport).toBeTypeOf("string");
    });
  });

  describe("component", () => {
    test("renders outlet in body", () => {
      let render = RTL.render(<Root />);
      expect(render.getByTestId("outlet")).toBeDefined();
    });
  });
}
