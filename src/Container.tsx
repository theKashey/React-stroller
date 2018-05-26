import * as React from 'react';
import {Component} from 'react';
import {axisToOverflow, axisTypes, getScrollBarWidth} from "./utils";

export interface ContainerProps {
  axis?: axisTypes;
  className?: string;
}

const getStyle = (scrollWidth: number, axis: axisTypes = 'vertical'): React.CSSProperties => {
  return {
    width: '100%',
    height: '100%',
    position: 'relative',
    [axisToOverflow[axis]]: 'scroll',
    paddingRight: (scrollWidth + 24) + 'px',
    boxSizing: "content-box",
  }
};

const containerStyle = {
  height: '100%',
  width: '100%',
  overflow: 'hidden',
};

export class Scrollable extends Component<ContainerProps> {
  scrollWidth = 0;

  constructor(props: ContainerProps) {
    super(props);
    this.scrollWidth = getScrollBarWidth();
  }

  render() {
    const {children, axis, className} = this.props;
    const {scrollWidth} = this;
    return (
      <div style={containerStyle} className={className}>
        <div style={getStyle(scrollWidth, axis)}>
          {children}
        </div>
      </div>
    );
  }
}