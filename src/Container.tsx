import * as React from 'react';
import {axisToOverflow, axisTypes, getScrollBarWidth} from "./utils";

export interface IContainerProps {
  axis?: axisTypes;
  className?: string;
  overscroll?: boolean;
  gap?: number;
  containerStyles?: CSSStyleDeclaration;
}

const getStyle = (scrollWidth: number, gap: number, overscroll: boolean, axis: axisTypes = 'vertical'): React.CSSProperties => {
  return {
    width: axis === 'vertical' ? `calc(100% + ${scrollWidth - gap}px)` : '100%',
    height: axis !== 'vertical' ? `calc(100% + ${scrollWidth - gap}px)` : '100%',
    // width:'100%',
    // height:'100%',
    maxWidth: 'inherit',
    maxHeight: 'inherit',
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
  maxWidth: 'inherit',
  maxHeight: 'inherit',
};

export const strollerStyle: React.CSSProperties = {
  height: '100%',
  width: '100%',
  maxWidth: 'inherit',
  maxHeight: 'inherit',
  display: 'inline-block',
};

export const subcontainerStyle: React.CSSProperties = {
  // minHeight: '100%', // an issue for windows
  // minWidth: '100%',
  width: '100%',
  height: '100%',
  // maxWidth: 'inherit',
  // maxHeight: 'inherit',
  position: 'relative',
  // display: 'inline-block', // WHY?
};

export class Strollable extends React.Component<IContainerProps> {
  scrollWidth = getScrollBarWidth();

  render() {
    const {children, axis, overscroll = false, className, gap = 0, containerStyles = {}} = this.props;
    return (
      <div style={containerStyle} className={className}>
        <div style={getStyle(this.scrollWidth, gap, overscroll, axis)}>
          <div style={{...subcontainerStyle, ...containerStyles}}>
            {children}
          </div>
        </div>
      </div>
    );
  }
}