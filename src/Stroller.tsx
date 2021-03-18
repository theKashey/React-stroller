import * as React from 'react';
import {supportsPassiveEvents} from 'detect-passive-events';

import {axisToProps, axisTypes, extractValues, findScrollableParent} from "./utils";
import {BarLocation, BarSizeFunction, BarView, StollerBar, IStrollerBarProps, ISideBar} from "./Bar";
import {DragMachine} from "./DragEngine";

import {StrollerProvider, StrollerStateProvider} from './context';
import {strollerStyle} from "./Container";

export interface IStrollerProps {
  axis?: axisTypes;
  targetAxis?: axisTypes;

  inBetween?: React.ReactNode;
  bar?: BarView,
  scrollBar?: React.ComponentType<IStrollerBarProps>;
  barSizeFunction?: BarSizeFunction;
  barClassName?: string,
  SideBar?: ISideBar;

  oppositePosition?: boolean,
  draggable?: boolean

  overrideLocation?: BarLocation;

  scrollKey?: any;

  passive?: boolean;

  onScroll?: (e: Event) => void;
}

export interface IComponentState {
  scrollWidth: number;
  scrollHeight: number;

  clientWidth: number;
  clientHeight: number;

  targetWidth?: number;
  targetHeight?: number;

  scrollLeft: number;
  scrollTop: number;

  hasScroll: boolean,

  dragPhase: string;
  mousePosition: number[];
  scrollPosition: number[];

  barLocation: BarLocation;
}

export class Stroller extends React.Component<IStrollerProps, IComponentState> {

  state = {
    scrollWidth: 0,
    scrollHeight: 0,
    clientWidth: 0,
    clientHeight: 0,
    targetWidth: 0,
    targetHeight: 0,
    scrollLeft: 0,
    scrollTop: 0,
    dragPhase: 'idle',
    mousePosition: [0, 0],
    scrollPosition: [0, 0],
    barLocation: 'inside' as BarLocation,
    hasScroll: false,
  };

  private dragMachine = DragMachine.create();

  private topNode: HTMLElement | undefined = undefined;
  private scrollableParent: HTMLElement | undefined = undefined;
  private scrollContainer: HTMLElement | null = null;
  private barRef: HTMLElement | undefined = undefined;
  private dettachParentCallback: null | (() => void) = null;

  componentDidMount() {
    this.scrollableParent = findScrollableParent(this.scrollContainer || this.topNode!, this.props.axis);
    const scrollableParent: any = this.scrollableParent;

    const barLocation = this.props.overrideLocation || this.scrollableParent === document.body
      ? 'fixed'
      : (
        (this.scrollContainer ? !this.topNode!.contains(this.scrollableParent) : true)
          ? 'inside'
          : 'outside'
      );

    this.setState({
      barLocation
    });

    this.attach(barLocation === 'fixed' ? window : this.scrollableParent);

    this.onContainerScroll();

    (this.dragMachine as any)._id = this;

    this.dragMachine
      .attrs({enabled: this.props.draggable})
      .observe((dragPhase: string) => this.setState({dragPhase}))
      .connect((message: string, coords: number[]) => {
        if (message === 'down') {
          this.setState({
            mousePosition: coords,
            scrollPosition:
              this.state.barLocation === 'fixed'
                ? [window.scrollX, window.scrollY]
                : [scrollableParent.scrollLeft, scrollableParent.scrollTop]
          })
        }
        if (message === 'move') {
          const {axis = 'vertical', targetAxis: pTargetAxis} = this.props;
          const {mousePosition} = this.state;

          const targetAxis = pTargetAxis || axis;
          const axScroll = axisToProps[axis];
          const axTarget = axisToProps[targetAxis];

          const delta = [mousePosition[0] - coords[0], mousePosition[1] - coords[1]];

          const st: any = this.state;

          const {space: axisSpace, scrollSpace: axisScrollSpace} = extractValues(st, axis);
          const {scrollSpace, targetSpace} = extractValues(st, targetAxis);

          const scrollFactor =
            axis === targetAxis
              ? scrollSpace / targetSpace
              : (axisScrollSpace - axisSpace) / targetSpace;

          const barPosition: any = scrollableParent.getBoundingClientRect();
          if (this.state.barLocation === 'fixed') {
            const X = axis === 'vertical' ? st.scrollPosition[0] : st.scrollPosition[0] - delta[axTarget.coord] * scrollFactor;
            const Y = axis !== 'vertical' ? st.scrollPosition[1] : st.scrollPosition[1] - delta[axTarget.coord] * scrollFactor;
            window.scrollTo(X, Y);
          } else if (barPosition[axTarget.start] < coords[axTarget.coord] && barPosition[axTarget.end] > coords[axTarget.coord]) {
            scrollableParent[axScroll.scroll] = st.scrollPosition[axScroll.coord] - delta[axTarget.coord] * scrollFactor;
          }

        }
      })
      .start('init')
  }

  componentWillUnmount() {
    this.dragMachine.destroy();
    this.dettach();
  }

  componentDidUpdate(prevProps: IStrollerProps) {
    this.dragMachine.attrs({enabled: this.props.draggable});
    this.dragMachine.put('check');
    if (this.props.scrollKey !== prevProps.scrollKey) {
      this.onContainerScroll();
    }
  }

  private onContainerScroll = (e?: Event) => {
    const topNode = this.scrollableParent as any;

    const scrollLeft = topNode.scrollLeft;
    const scrollTop = topNode.scrollTop;

    const scrollWidth = topNode.scrollWidth;
    const scrollHeight = topNode.scrollHeight;

    const targetWidth = this.topNode?.clientWidth;
    const targetHeight = this.topNode?.clientHeight;

    const clientWidth = topNode.clientWidth;
    const clientHeight = topNode.clientHeight;


    const isFixed = this.state.barLocation === 'fixed';

    const st: any = this.state;

    const {axis = 'vertical', onScroll } = this.props;

    const mainScroll = extractValues(st, axis);

    this.setState({
      scrollWidth,
      scrollHeight,

      targetWidth,
      targetHeight,

      clientWidth: isFixed ? window.innerWidth : clientWidth,
      clientHeight: isFixed ? window.innerHeight : clientHeight,

      scrollLeft: isFixed ? window.scrollX : scrollLeft,
      scrollTop: isFixed ? window.scrollY : scrollTop,

      hasScroll: mainScroll.scrollSpace > mainScroll.space,
    });

    if (onScroll && e) {
      onScroll(e);
    }
  };

  private attach(parent: HTMLElement | Window) {
    this.dettach();
    const {passive} = this.props;
    const options: any = passive && supportsPassiveEvents ? {passive: true} : undefined;
    parent.addEventListener('scroll', this.onContainerScroll, options);
    this.dettachParentCallback = () => {
      parent.removeEventListener('scroll', this.onContainerScroll, options);
    };
  }

  private dettach() {
    if (this.dettachParentCallback) {
      this.dettachParentCallback();
      this.dettachParentCallback = null;
    }
  }

  private setScrollContainer = (ref: HTMLElement | null) => this.scrollContainer = ref;

  private setTopNode = (topNode: HTMLElement) => this.topNode = topNode;

  private setBarRef = (barRef: HTMLElement) => {
    this.barRef = barRef;
    this.dragMachine
      .attrs({node: this.barRef})
      .put('check');
  };

  private strollerProviderValue = {
    setScrollContainer: this.setScrollContainer
  };

  render() {
    const {
      children,
      bar,
      inBetween,
      axis = 'vertical',
      targetAxis,
      oppositePosition = false,
      draggable = false,
      barSizeFunction,
      barClassName,
      SideBar,
    } = this.props;

    const {dragPhase} = this.state;
    const st: any = this.state;

    const ax = axisToProps[axis];

    const scrollSpace: number = st[ax.scrollSpace];

    const Bar = this.props.scrollBar || StollerBar;

    return (
      <StrollerStateProvider value={this.state}>
        <div ref={this.setTopNode as any} style={strollerStyle}>
          <StrollerProvider value={this.strollerProviderValue}>
            {children}
          </StrollerProvider>
          <div>
            {inBetween}
          </div>
          {scrollSpace
            ? (
              <Bar
                mainScroll={extractValues(st, axis)}
                targetScroll={extractValues(st, targetAxis || axis)}

                forwardRef={this.setBarRef}
                internal={bar}
                axis={axis}
                targetAxis={targetAxis || axis}

                oppositePosition={oppositePosition}

                draggable={draggable}
                dragging={dragPhase === 'dragging'}

                sizeFunction={barSizeFunction}
                location={st.barLocation}

                className={barClassName}
                SideBar={SideBar}
              />
            )
            : null
          }
        </div>
      </StrollerStateProvider>
    );
  }
}