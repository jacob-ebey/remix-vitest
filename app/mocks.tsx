import * as React from "react";
import * as ReactRouter from "react-router";
import type * as RemixReact from "@remix-run/react";

type CreateRemixReactMockOptions = {
  path: string;
  Outlet?: React.ComponentType<React.ComponentProps<typeof RemixReact.Outlet>>;
};

export function createRemixReactMock(options: CreateRemixReactMockOptions) {
  let MockedLink = vi.fn(
    ({
      to,
      reloadDocument,
      replace,
      state,
      prefetch,
      children,
      ...rest
    }: React.ComponentProps<typeof RemixReact.Link>) => {
      let href = ReactRouter.createPath(
        ReactRouter.resolvePath(to, options.path)
      );
      return (
        <a
          {...rest}
          href={href}
          test-reloaddocument={reloadDocument ? "true" : undefined}
          test-replace={replace ? "true" : undefined}
          test-state={state ? JSON.stringify(state) : undefined}
          test-prefetch={prefetch}
        >
          {children}
        </a>
      );
    }
  );

  return {
    useLoaderData: vi.fn(),
    Link: MockedLink,
    Links: vi.fn(() => <link data-testid="remix-meta" />),
    LiveReload: vi.fn(() => <script data-testid="remix-live-reload" />),
    Meta: vi.fn(() => <title data-testid="remix-meta">remix-meta</title>),
    Outlet: options.Outlet || vi.fn(() => null),
    ScrollRestoration: vi.fn(() => (
      <script data-testid="remix-scroll-restoration" />
    )),
    Scripts: vi.fn(() => <script data-testid="remix-scripts" />),
  };
}
