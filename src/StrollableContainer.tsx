import {ContainerProps, Strollable, strollerStyle} from "./Container";
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
  <div style={strollerStyle}>
    <Stroller
      axis={axis}
      bar={bar}
      oppositePosition={oppositePosition}
      draggable={draggable}
    >
      <Strollable axis={axis} className={className}>
        <StrollCaptor/>
        {children}
      </Strollable>
    </Stroller>
  </div>
)