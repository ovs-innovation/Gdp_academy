import { BrowserRouter, type BrowserRouterProps } from 'react-router-dom';
import { type PropsWithChildren } from 'react';

const routerProps: BrowserRouterProps = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
};

export const RootRouter = ({ children }: PropsWithChildren) => (
  <BrowserRouter {...routerProps}>{children}</BrowserRouter>
);
