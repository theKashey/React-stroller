import * as React from 'react';
import {Component} from 'react';
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
    paddingRight: (scrollWidth + 24) + 'px',
    boxSizing: "content-box",
  }
};

const containerStyle: React.CSSProperties = {
  height: '100%',
  width: '100%',
  overflow: 'hidden',
};

const subcontainerStyle: React.CSSProperties = {
  height: '100%',
  width: '100%',
  position: 'relative',
  display: 'inline-block',
};

export class Scrollable extends Component<ContainerProps> {
  scrollWidth = 0;

  constructor(props: ContainerProps) {
    super(props);
    this.scrollWidth = getScrollBarWidth();
  }

  render() {
    const {children, axis, overscroll = false, className} = this.props;
    const {scrollWidth} = this;
    return (
      <div style={containerStyle} className={className}>
        <div style={getStyle(scrollWidth, overscroll, axis)}>
          <div style={subcontainerStyle}>
            {children}
          </div>
        </div>
      </div>
    );
  }
}