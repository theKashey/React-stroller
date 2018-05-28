import * as React from 'react';
import {axisToOverflow, axisTypes, getScrollBarWidth} from "./utils";

export interface ContainerProps {
  axis?: axisTypes;
  className?: string;
  overscroll?: boolean
}

const getStyle = (scrollWidth: number, overscroll: boolean, axis: axisTypes = 'vertical'): React.CSSProperties => {
  return {
    width: '100%',
    height: '100%',
    position: 'relative',
    [axisToOverflow[axis]]: 'scroll',
    overscrollBehavior: overscroll ? 'contain' : 'inherit',
    [axis === 'vertical' ? 'paddingRight' : 'paddingBottom']: (scrollWidth + 24) + 'px',
    boxSizing: "content-box",
  }
};

const containerStyle: React.CSSProperties = {
  height: '100%',
  width: '100%',
  overflow: 'hidden',
};

export const strollerStyle: React.CSSProperties = {
  height: '100%',
  width: '100%',
  display: 'inline-block',
};

export const subcontainerStyle: React.CSSProperties = {
  minHeight: '100%',
  minWidth: '100%',
  position: 'relative',
  display: 'inline-block',
};

export class Strollable extends React.Component<ContainerProps> {
  scrollWidth = 0;

  constructor(props: ContainerProps) {
    super(props);
    this.scrollWidth = getScrollBarWidth();
  }

  render() {
    const {children, axis, overscroll = false, className} = this.props;
    return (
      <div style={containerStyle} className={className}>
        <div style={getStyle(this.scrollWidth, overscroll, axis)}>
          <div style={subcontainerStyle}>
            {children}
          </div>
        </div>
      </div>
    );
  }
}