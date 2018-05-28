import * as React from 'react';

export interface IStrollerContext {
  setScrollContainer: (ref: HTMLElement | null) => any;
}

const contextDefault:IStrollerContext =  {
  setScrollContainer: () => { throw new Error('StrollerCaptor used without Stroller')}
};

export const context = React.createContext(contextDefault);

export const StrollerProvider = context.Provider;
export const StrollerContext = context.Consumer;