import * as React from 'react';
import {Component} from 'react';

import {axisToAxis, axisTypes, findScrollableParent} from "./utils";
import {BarSizeFunction, BarView, defaultSizeFunction, StollerBar} from "./Bar";
import {DragMachine} from "./DragEngine";

import {StrollerProvider} from './context';
import {subcontainerStyle} from "./Container";

export interface StrollerProps {
  axis?: axisTypes;
  bar?: BarView,
  oppositePosition?: boolean,
  draggable?: boolean
  barSizeFunction?: BarSizeFunction;
}

export interface ComponentState {
  scrollWidth: number;
  scrollHeight: number;

  clientWidth: number;
  clientHeight: number;

  dragPhase: string;
  mousePosition: number[];
}

const axisToProps = {
  'vertical': {
    scroll: 'scrollTop',
    space: 'clientHeight',
    scrollSpace: 'scrollHeight',
    start: 'top',
    end: 'bottom',

    coord: 1,
  },
  'horizontal': {
    scroll: 'scrollLeft',
    space: 'clientWidth',
    scrollSpace: 'scrollWidth',
    start: 'left',
    end: 'right',

    coord: 0,
  }
};

export class Stroller extends Component<StrollerProps, ComponentState> {

  state = {
    scrollWidth: 0,
    scrollHeight: 0,
    clientWidth: 0,
    clientHeight: 0,
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

    (this.dragMachine as any)._id=this;

    this.dragMachine
      .attrs({enabled: this.props.draggable})
      .observe((dragPhase: string) => this.setState({dragPhase}))
      .connect((message: string, coords: number[]) => {
        if (message == 'down') {
          this.setState({mousePosition: coords})
        }
        if (message == 'move') {
          const {axis = 'vertical'} = this.props;
          const {mousePosition} = this.state;
          const ax = axisToProps[axis];
          const delta = [mousePosition[0] - coords[0], mousePosition[1] - coords[1]];
          const scrollableParent: any = this.scrollableParent;


          const scrollSpace: number = scrollableParent[ax.scrollSpace];
          const space: number = scrollableParent [ax.space];
          const scrollFactor = scrollSpace / space;

          const barPosition: any = scrollableParent.getBoundingClientRect();
          if (barPosition[ax.start] < coords[ax.coord] && barPosition[ax.end] > coords[ax.coord]) {
            scrollableParent[ax.scroll] -= delta[ax.coord] * scrollFactor;
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
    const clientHeight = topNode.clientHeight;

    const scrollLeft = topNode.scrollLeft;
    const scrollWidth = topNode.scrollWidth;
    const clientWidth = topNode.clientWidth;


    if (
      this.state.scrollWidth !== scrollWidth ||
      this.state.scrollHeight !== scrollHeight ||
      this.state.clientWidth !== clientWidth ||
      this.state.clientHeight !== clientHeight
    ) {
      this.setState({
        scrollWidth,
        scrollHeight,
        clientWidth,
        clientHeight,
      });
    }

    const {dragPhase} = this.state;
    const {barSizeFunction = defaultSizeFunction, axis = 'vertical'} = this.props;
    const ax = axisToProps[axis];

    const set: any = {
      clientWidth,
      clientHeight,
      scrollWidth,
      scrollHeight,
      scrollTop,
      scrollLeft
    };

    const scrollSpace: number = set[ax.scrollSpace];
    const space: number = set[ax.space];
    const scroll: number = set[ax.scroll];

    const usableSpace = scrollSpace - space;
    const barSize = barSizeFunction(space, scrollSpace, {dragging: dragPhase === 'dragging'});
    const top =
      this.isInnerStroller
        ? (scrollSpace - barSize) * (scroll / usableSpace)
        : (space - barSize) * (scroll / usableSpace)

    this.barTransform = 'translate' + (axisToAxis[axis]) + '(' + (Math.max(0, Math.min(scrollHeight - barSize, top))) + 'px)';
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
      barSizeFunction
    } = this.props;

    const {dragPhase} = this.state;
    const st: any = this.state;

    const ax = axisToProps[axis];

    const scrollSpace: number = st[ax.scrollSpace];

    return (
      <div ref={this.setTopNode as any} style={{...subcontainerStyle, position: 'static'}}>
        <StrollerProvider value={{
          setScrollContainer: this.setScrollContainer
        }}>
          {children}
        </StrollerProvider>
        {scrollSpace && <StollerBar
          scrollSpace={scrollSpace}
          space={st[ax.space]}
          forwardRef={this.setBarRef}
          internal={bar}
          axis={axis}
          oppositePosition={oppositePosition}
          draggable={draggable}
          dragging={dragPhase === 'dragging'}
          sizeFunction={barSizeFunction}
          barTransform={this.barTransform}
        />
        }
      </div>
    );
  }
}