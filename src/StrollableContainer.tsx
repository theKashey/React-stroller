import {ContainerProps, Scrollable, subcontainerStyle} from "./Container";
import {Stroller, StrollerProps} from "./Stroller";
import * as React from "react";
import {StrollCaptor} from "./StrollCaptor";

export type Props = ContainerProps & StrollerProps;

export const StrollableContainer: React.SFC<Props> = ({
                                                        children,
                                                        axis,
                                                        className,
                                                        bar,
                                                        oppositePosition,
                                                        draggable,
                                                      }) => (
  <div style={subcontainerStyle}>
    <Stroller
      axis={axis}
      bar={bar}
      oppositePosition={oppositePosition}
      draggable={draggable}
    >
      <Scrollable axis={axis} className={className}>
        <StrollCaptor/>
        {children}
      </Scrollable>
    </Stroller>
  </div>
)