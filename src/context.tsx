import * as React from 'react';

interface Context {
  setScrollContainer: (ref: HTMLElement | null) => any;
}

export const context = React.createContext({
  setScrollContainer: () => { throw new Error('StrollerCaptor used without Stroller')}
} as Context);

export const StrollerProvider = context.Provider;
export const StrollerContext = context.Consumer;