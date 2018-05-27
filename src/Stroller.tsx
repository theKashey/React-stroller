import * as React from 'react';
import {Component} from 'react';

import {axisToAxis, axisTypes, findScrollableParent} from "./utils";
import {BarHeightFunction, BarView, defaultHeightFunction, StollerBar} from "./Bar";
import {DragMachine} from "./DragEngine";

import {StrollerProvider} from './context';
import {subcontainerStyle} from "./Container";

export interface StrollerProps {
  axis?: axisTypes;
  bar?: BarView,
  oppositePosition?: boolean,
  draggable?: boolean
  barHeightFunction?: BarHeightFunction;
}

export interface ComponentState {
  scrollTop: number;
  scrollHeight: number;
  height: number;
  dragPhase: string;
  mousePosition: number[];
}

const axisToProps = {
  'vertical': {
    scroll:'scrollTop',
    space:'clientHeight',
    scrollSpace:'scrollHeight',
    start: 'top',
    end:'bottom',
  },
  'horizontal': {
    scroll:'scrollLeft',
    space:'clientWidth',
    scrollSpace:'scrollWidth',
    start: 'left',
    end:'right',
  }
};

export class Stroller extends Component<StrollerProps, ComponentState> {

  state = {
    scrollWidth: 0,
    scrollTop: 0,
    scrollHeight: 0,
    height: 0,
    dragPhase: 'idle',
    mousePosition: [0, 0],
  };

  private dragMachine = DragMachine.create();

  private topNode: HTMLElement | undefined = undefined;
  private scrollableParent: HTMLElement | undefined = undefined;
  private scrollContainer: HTMLElement | null = null;
  private barRef: HTMLElement | undefined = undefined;
  private isInnerStroller: boolean = false;

  private barTransform: string = ''; // store transform on non tracked field

  componentDidMount() {
    this.scrollableParent = this.attach(findScrollableParent(this.scrollContainer || this.topNode!));
    this.isInnerStroller = this.scrollContainer ? !this.topNode!.contains(this.scrollableParent) : true;
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
          const axisCoord = this.props.axis === 'vertical' ? 1 : 0;
          const delta = [mousePosition[0] - coords[0], mousePosition[1] - coords[1]];
          const {scrollableParent} = this;

          const scrollHeight = scrollableParent.scrollHeight;
          const height = scrollableParent.clientHeight;
          const scrollFactor = scrollHeight / height;

          const barPosition = scrollableParent.getBoundingClientRect();
          if (barPosition.top < coords[axisCoord] && barPosition.bottom > coords[axisCoord]) {
            scrollableParent.scrollTop -= delta[axisCoord] * scrollFactor;
          }

          this.setState({mousePosition: coords})
        }
      })
      .start('init')
  }

  componentWillUnmount() {
    this.dragMachine.destroy();
  }

  componentDidUpdate() {
    this.dragMachine.attrs({enabled: this.props.draggable});
    this.dragMachine.put('check');
  }

  onContainerScroll = () => {
    const topNode = this.scrollableParent as any;

    const scrollTop = topNode.scrollTop;
    const scrollHeight = topNode.scrollHeight;
    const height = topNode.clientHeight;


    if (
      this.state.scrollHeight !== scrollHeight ||
      this.state.height !== height
    ) {
      this.setState({
        scrollHeight,
        height,
      });
    }

    const {dragPhase} = this.state;
    const {barHeightFunction = defaultHeightFunction, axis = 'vertical'} = this.props;
    const usableHeight = scrollHeight - height;
    const barHeight = barHeightFunction(height, scrollHeight, {dragging: dragPhase === 'dragging'});
    const top =
      this.isInnerStroller
        ? (scrollHeight - barHeight) * (scrollTop / usableHeight)
        : (height - barHeight) * (scrollTop / usableHeight)

    this.barTransform = 'translate' + (axisToAxis[axis]) + '(' + (Math.max(0, Math.min(scrollHeight - barHeight, top))) + 'px)';
    if (this.barRef) {
      // update transform via DOM api to make it in sync
      this.barRef.style.transform = this.barTransform;
    }
  };

  attach(parent: HTMLElement) {
    parent.addEventListener('scroll', this.onContainerScroll);
    return parent;
  }

  setScrollContainer = (ref: HTMLElement | null) => this.scrollContainer = ref;

  setTopNode = (topNode: HTMLElement) => this.topNode = topNode;

  setBarRef = (barRef: HTMLElement) => {
    this.barRef = barRef;
    this.dragMachine
      .attrs({node: this.barRef})
      .put('check');
  };

  render() {
    const {
      children,
      bar,
      axis = 'vertical',
      oppositePosition = false,
      draggable = false,
      barHeightFunction
    } = this.props;

    const {scrollTop, scrollHeight, height, dragPhase} = this.state;

    return (
      <div ref={this.setTopNode as any} style={subcontainerStyle}>
        <StrollerProvider value={{
          setScrollContainer: this.setScrollContainer
        }}>
          {children}
        </StrollerProvider>
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
          heightFunction={barHeightFunction}
          barTransform={this.barTransform}
        />
        }
      </div>
    );
  }
}