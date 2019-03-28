import * as React from 'react';
import {IStrollerState} from "./types";

export interface IStrollerContext {
  setScrollContainer: (ref: HTMLElement | null) => any;
}

const contextDefault:IStrollerContext =  {
  setScrollContainer: () => { throw new Error('StrollerCaptor used without Stroller')}
};

export const context = React.createContext(contextDefault);
export const StrollerProvider = context.Provider;
export const StrollerContext = context.Consumer;

export const stateContext = React.createContext({} as IStrollerState);
export const StrollerStateProvider = stateContext.Provider;
export const StrollerState = stateContext.Consumer;