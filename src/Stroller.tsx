import * as React from 'react';
import {Component} from 'react';

import {axisTypes, findScrollableParent} from "./utils";
import {StollerBar} from "./Bar";
import {DragMachine} from "./DragEngine";

export interface StrollerProps {
  axis?: axisTypes;
  bar?: React.ComponentType,
  oppositePosition?: boolean,
  draggable?: boolean
  barOffset?: number | 'auto';
}

export interface ComponentState {
  scrollTop: number;
  scrollHeight: number;
  height: number;
  dragPhase: string;
  mousePosition: number[];
}

export class Stroller extends Component<StrollerProps, ComponentState> {

  state = {
    scrollWidth: 0,
    scrollTop: 0,
    scrollHeight: 0,
    height: 0,
    dragPhase: 'idle',
    mousePosition: [0, 0]
  };

  private dragMachine = DragMachine.create();

  private topNode: HTMLElement | undefined = undefined;
  private scrollableParent: HTMLElement | undefined = undefined;
  private barRef: HTMLElement | undefined = undefined;

  componentDidMount() {
    this.scrollableParent = this.attach(findScrollableParent(this.topNode!));
    this.onContainerScroll();

    this.dragMachine
      .attrs({enabled: this.props.draggable})
      .observe((dragPhase: string) => this.setState({dragPhase}))
      .connect((message: string, coords: number[]) => {
        if (message == 'down') {
          this.setState({mousePosition: coords})
        }
        if (message == 'move') {
          const {mousePosition} = this.state;
          const delta = [mousePosition[0] - coords[0], mousePosition[1] - coords[1]];
          const {scrollableParent} = this;

          const scrollHeight = scrollableParent.scrollHeight;
          const height = scrollableParent.clientHeight;
          const scrollFactor = scrollHeight / height;

          const barPosition = scrollableParent.getBoundingClientRect();
          if (barPosition.top < coords[1] && barPosition.bottom > coords[1]) {
            scrollableParent.scrollTop -= delta[1] * scrollFactor;
          }

          this.setState({mousePosition: coords})
        }
      })
      .start('init')
  }

  componentWillUnmount() {
    this.dragMachine.destroy();
  }

  attach(parent: HTMLElement) {
    parent.addEventListener('scroll', this.onContainerScroll);
    return parent;
  }

  onContainerScroll = () => {
    const topNode = this.scrollableParent as any;

    const scrollTop = topNode.scrollTop;
    const scrollHeight = topNode.scrollHeight;
    const height = topNode.clientHeight;

    this.setState({
      scrollTop,
      scrollHeight,
      height,
    });

  };

  componentDidUpdate() {
    this.dragMachine.attrs({enabled: this.props.draggable});
    this.dragMachine.put('check');
  }

  setTopNode = (topNode: HTMLElement) => this.topNode = topNode;

  setBarRef = (barRef: HTMLElement) => {
    this.barRef = barRef;
    this.dragMachine
      .attrs({node: this.barRef})
      .put('check');
  };

  render() {
    const {children, bar, axis = 'vertical', oppositePosition = false, draggable = false, barOffset} = this.props;
    const {scrollTop, scrollHeight, height, dragPhase} = this.state;

    return (
      <div ref={this.setTopNode as any}>
        {scrollHeight && <StollerBar
          scrollTop={scrollTop}
          scrollHeight={scrollHeight}
          height={height}
          forwardRef={this.setBarRef}
          internal={bar}
          axis={axis}
          oppositePosition={oppositePosition}
          draggable={draggable}
          dragging={dragPhase === 'dragging'}
          offset={barOffset}
        />
        }
        {children}
      </div>
    );
  }
}