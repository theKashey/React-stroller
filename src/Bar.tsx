import * as React from 'react';
import {axisToAxis, axisTypes, getScrollBarWidth} from "./utils";

export type BarView = React.ComponentType<{ dragging?: boolean }> | React.ComponentType<any>;

export type BarHeightFunction = (height: number, scrollHeight: number, flags: { dragging: boolean }) => number;

export interface StrollerBarProps {
  scrollTop: number;
  scrollHeight: number;
  height: number;
  forwardRef: (ref: HTMLElement) => void;
  internal?: BarView;
  axis?: axisTypes,
  oppositePosition?: boolean;
  offset?: number | 'auto';
  draggable?: boolean;
  dragging?: boolean;
  heightFunction?: BarHeightFunction
}

const Bar: BarView = () => (
  <div
    style={{
      width: '8px',
      height: '100%',
      borderRadius: 8,
      backgroundColor: 'rgba(0,0,0,0.5)'
    }}
  />
);

const positions = (offset: number) => ({
  vertical: {
    0: {
      top: 0,
      right: offset + 'px',
    },
    1: {
      top: 0,
      left: 0,
    }
  },

  horizontal: {
    0: {
      bottom: offset + 'px',
      left: 0,
    },
    1: {
      top: 0,
      left: 0,
    },
  }
});

const defaultHeightFunction = (height: number, scrollHeight: number): number => (
  height * (height / scrollHeight)
);

export const StollerBar: React.SFC<StrollerBarProps> = ({
                                                          scrollTop,
                                                          scrollHeight,
                                                          height,
                                                          forwardRef,
                                                          internal,
                                                          axis = 'vertical',
                                                          oppositePosition = false,
                                                          offset = 'auto',
                                                          draggable = false,
                                                          heightFunction = defaultHeightFunction,
                                                          dragging = false
                                                        }) => {
  if (scrollHeight <= height) {
    return null;
  }

  const usableHeight = scrollHeight - height;
  const barHeight = heightFunction(height, scrollHeight, {dragging});
  const top = (scrollHeight - barHeight) * (scrollTop / usableHeight);

  const Internal: BarView = internal || Bar;

  const barOffset = offset === 'auto' ? (getScrollBarWidth() + 24) : offset;
  return (
    <div
      ref={forwardRef as any}
      style={{
        position: 'absolute',
        display: 'flex',
        cursor: dragging ? 'grabbing' : (draggable ? 'grab' : 'default'),

        height: Math.round(barHeight) + 'px',

        ...(positions(barOffset)[axis][oppositePosition ? 1 : 0] as any),

        transform: 'translate' + (axisToAxis[axis]) + '(' + (Math.max(0, Math.min(scrollHeight - barHeight, top))) + 'px)',

        willChange: 'transform'
      }}
    >
      <Internal dragging={dragging}/>
    </div>
  );
}