import * as React from 'react';
import {axisToAxis, axisTypes} from "./utils";

export type BarView = React.ComponentType<{ dragging?: boolean, axis?: axisTypes }> | React.ComponentType<any>;

export type BarSizeFunction = (height: number, scrollHeight: number, flags: { dragging: boolean }) => number;

export type BarLocation = "fixed" | "inside" | "outside";

export interface IScrollParams {
  scrollSpace: number;
  scroll: number;
  space: number;
}

export interface IStrollerBarProps {
  mainScroll: IScrollParams;
  targetScroll?: IScrollParams;

  forwardRef: (ref: HTMLElement) => void;
  internal?: BarView;
  axis?: axisTypes,
  targetAxis?: axisTypes,
  oppositePosition?: boolean;
  draggable?: boolean;
  dragging?: boolean;
  sizeFunction?: BarSizeFunction;
  location: BarLocation;
}

const Bar: BarView = ({axis}: { axis: axisTypes }) => (
  <div
    style={{
      [axis === 'vertical' ? 'width' : 'height']: '8px',
      [axis === 'vertical' ? 'height' : 'width']: '100%',
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

export const StollerBar: React.SFC<IStrollerBarProps> = ({
                                                          mainScroll,
                                                          // targetScroll,

                                                          forwardRef,
                                                          internal,
                                                          axis = 'vertical',
                                                          oppositePosition = false,
                                                          draggable = false,
                                                          sizeFunction = defaultSizeFunction,
                                                          dragging = false,
                                                          location
                                                        }) => {
  if (mainScroll.scrollSpace <= mainScroll.space) {
    return null;
  }

  const barSize = sizeFunction(mainScroll.space, mainScroll.scrollSpace, {dragging});

  const Internal: BarView = internal || Bar;

  const usableSpace = mainScroll.scrollSpace - mainScroll.space;
  const top =
    location === 'inside'
      ? (mainScroll.scrollSpace - barSize) * (mainScroll.scroll / usableSpace)
      : (mainScroll.space - barSize) * (mainScroll.scroll / usableSpace);

  const transform = 'translate' + (axisToAxis[axis]) + '(' + (Math.max(0, Math.min(mainScroll.scrollSpace - barSize, top))) + 'px)';

  return (
    <div
      ref={forwardRef as any}
      style={{
        position: location === 'fixed' ? 'fixed' : 'absolute',
        display: 'flex',
        cursor: dragging ? 'grabbing' : (draggable ? 'grab' : 'default'),

        [axis === 'vertical' ? 'height' : 'width']: Math.round(barSize) + 'px',

        ...(positions[axis][oppositePosition ? 1 : 0] as any),

        transform,
        willChange: 'transform'
      }}
    >
      <Internal dragging={dragging} axis={axis}/>
    </div>
  );
}