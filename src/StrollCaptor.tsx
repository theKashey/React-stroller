import * as React from 'react';
import {StrollerContext} from "./context";

export const StrollCaptor = () => (
  <StrollerContext>
    {({setScrollContainer}) => (
      <div ref={ref => setScrollContainer(ref)}/>
    )}
  </StrollerContext>
);