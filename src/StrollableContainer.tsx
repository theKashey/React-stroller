import {IContainerProps, Strollable, strollerStyle} from "./Container";
import {Stroller, IStrollerProps} from "./Stroller";
import * as React from "react";
import {StrollCaptor} from "./StrollCaptor";

export type Props = IContainerProps & IStrollerProps;

export const StrollableContainer: React.SFC<Props> = ({
                                                        children,
                                                        className,

                                                        axis,
                                                        bar,
                                                        scrollBar,
                                                        oppositePosition,
                                                        draggable,

                                                        barSizeFunction,
                                                        barClassName,
                                                        SideBar,

                                                        overrideLocation,
                                                        targetAxis,

                                                        overscroll,

                                                        scrollKey,
                                                        gap
                                                      }) => (
  <div style={strollerStyle}>
    <Stroller
      axis={axis}
      targetAxis={targetAxis}

      bar={bar}
      scrollBar={scrollBar}
      barSizeFunction={barSizeFunction}
      barClassName={barClassName}
      SideBar={SideBar}

      oppositePosition={oppositePosition}
      draggable={draggable}

      overrideLocation={overrideLocation}

      scrollKey={scrollKey}
    >
      <Strollable axis={axis} className={className} overscroll={overscroll} gap={gap}>
        <StrollCaptor/>
        {children}
      </Strollable>
    </Stroller>
  </div>
)