import * as React from "react";
import * as ReactRouter from "react-router";
import type * as RemixReactTypes from "@remix-run/react";

type CreateRemixReactMockOptions = {
  path: string;
};

export function createRemixReactMock(options: CreateRemixReactMockOptions) {
  let MockedLink = ({
    to,
    reloadDocument,
    replace,
    state,
    prefetch,
    children,
    ...rest
  }: React.ComponentProps<typeof RemixReactTypes.Link>) => {
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
  };

  return {
    useLoaderData: vi.fn(),
    Link: MockedLink,
  };
}
