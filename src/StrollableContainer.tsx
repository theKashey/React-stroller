import {ContainerProps, Scrollable} from "./Container";
import {Stroller, StrollerProps} from "./Stroller";
import * as React from "react";

export type Props = ContainerProps & StrollerProps;

export const StrollableContainer: React.SFC<Props> = ({
                                                        children,
                                                        axis,
                                                        className,
                                                        bar,
                                                        oppositePosition,
                                                        draggable,
                                                      }) => (
  <Scrollable axis={axis} className={className}>
    <Stroller
      axis={axis}
      bar={bar}
      oppositePosition={oppositePosition}
      draggable={draggable}
    />
    {children}
  </Scrollable>
)