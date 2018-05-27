import * as React from 'react';

export interface IStrollerContext {
  setScrollContainer: (ref: HTMLElement | null) => any;
}

export const context = React.createContext({
  setScrollContainer: () => { throw new Error('StrollerCaptor used without Stroller')}
} as IStrollerContext);

export const StrollerProvider = context.Provider;
export const StrollerContext = context.Consumer;