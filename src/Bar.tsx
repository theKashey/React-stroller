import * as React from 'react';
import {axisTypes} from "./utils";

export type BarView = React.ComponentType<{ dragging?: boolean }> | React.ComponentType<any>;

export type BarSizeFunction = (height: number, scrollHeight: number, flags: { dragging: boolean }) => number;

export interface StrollerBarProps {
  scrollSpace: number;
  space: number;
  forwardRef: (ref: HTMLElement) => void;
  internal?: BarView;
  axis?: axisTypes,
  oppositePosition?: boolean;
  draggable?: boolean;
  dragging?: boolean;
  sizeFunction?: BarSizeFunction,
  barTransform: string
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

const positions = {
  vertical: {
    0: {
      top: 0,
      right: 0,
    },
    1: {
      top: 0,
      left: 0,
    }
  },

  horizontal: {
    0: {
      bottom: 0,
      left: 0,
    },
    1: {
      top: 0,
      left: 0,
    },
  }
};

export const defaultSizeFunction = (height: number, scrollHeight: number): number => (
  height * (height / scrollHeight)
);

export const StollerBar: React.SFC<StrollerBarProps> = ({
                                                          scrollSpace,
                                                          space,
                                                          forwardRef,
                                                          internal,
                                                          axis = 'vertical',
                                                          oppositePosition = false,
                                                          draggable = false,
                                                          sizeFunction = defaultSizeFunction,
                                                          dragging = false,
                                                          barTransform
                                                        }) => {
  if (scrollSpace <= space) {
    return null;
  }

  const barHeight = sizeFunction(space, scrollSpace, {dragging});

  const Internal: BarView = internal || Bar;

  return (
    <div
      ref={forwardRef as any}
      style={{
        position: 'absolute',
        display: 'flex',
        cursor: dragging ? 'grabbing' : (draggable ? 'grab' : 'default'),

        [axis == 'vertical' ? 'height' : 'width']: Math.round(barHeight) + 'px',

        ...(positions[axis][oppositePosition ? 1 : 0] as any),

        transform: barTransform + ' translateZ(0)',
        willChange: 'transform'
      }}
    >
      <Internal dragging={dragging}/>
    </div>
  );
}