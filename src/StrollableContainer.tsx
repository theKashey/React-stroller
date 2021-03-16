import {IContainerProps, Strollable, strollerStyle} from "./Container";
import {Stroller, IStrollerProps} from "./Stroller";
import * as React from "react";
import {StrollCaptor} from "./StrollCaptor";

export type Props = IContainerProps & IStrollerProps;

export const StrollableContainer: React.SFC<Props> = (
  {
    children,
    className,

    axis,
    bar,
    inBetween,

    scrollBar,
    oppositePosition,
    draggable,

    barSizeFunction,
    barClassName,
    SideBar,

    overrideLocation,
    targetAxis,

    overscroll,
    containerStyles,
    minScrollbarWidth,

    scrollKey,
    gap,

    onScroll
  }
) => (
  <div style={strollerStyle}>
    <Stroller
      axis={axis}
      targetAxis={targetAxis}

      inBetween={inBetween}

      bar={bar}
      scrollBar={scrollBar}
      barSizeFunction={barSizeFunction}
      barClassName={barClassName}
      SideBar={SideBar}

      oppositePosition={oppositePosition}
      draggable={draggable}

      overrideLocation={overrideLocation}

      scrollKey={scrollKey}

      onScroll={onScroll}
    >
      <Strollable
        axis={axis}
        className={className}
        overscroll={overscroll}
        gap={gap}
        containerStyles={containerStyles}
        minScrollbarWidth={minScrollbarWidth}
      >
        <StrollCaptor/>
        {children}
      </Strollable>
    </Stroller>
  </div>
)