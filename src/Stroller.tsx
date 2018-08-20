import * as React from 'react';

import {axisToProps, axisTypes, extractValues, findScrollableParent} from "./utils";
import {BarLocation, BarSizeFunction, BarView, StollerBar, IStrollerBarProps, ISideBar} from "./Bar";
import {DragMachine} from "./DragEngine";

import {StrollerProvider, StrollerStateProvider} from './context';
import {strollerStyle} from "./Container";

export interface IStrollerProps {
  axis?: axisTypes;
  targetAxis?: axisTypes;

  bar?: BarView,
  scrollBar?: React.ComponentType<IStrollerBarProps>;
  barSizeFunction?: BarSizeFunction;
  barClassName?: string,
  SideBar?: ISideBar;

  oppositePosition?: boolean,
  draggable?: boolean

  overrideLocation?: BarLocation;

  scrollKey?: any;
}

export interface IComponentState {
  scrollWidth: number;
  scrollHeight: number;

  clientWidth: number;
  clientHeight: number;

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
  private attachParent: HTMLElement | Window | undefined = undefined;

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

          const {space: axisSpace, scrollSpace: axisScrollSpace}: { scrollSpace: number, space: number } = extractValues(st, axis);
          const {scrollSpace, space}: { scrollSpace: number, space: number } = extractValues(st, targetAxis);

          const scrollFactor =
            axis === targetAxis
              ? scrollSpace / space
              : (axisScrollSpace - axisSpace) / space;

          const barPosition: any = scrollableParent.getBoundingClientRect();
          if (this.state.barLocation === 'fixed') {
            const X = axis === 'vertical' ? st.scrollPosition[0] : st.scrollPosition[0] - delta[axTarget.coord] * scrollFactor;
            const Y = axis !== 'vertical' ? st.scrollPosition[1] : st.scrollPosition[1] - delta[axTarget.coord] * scrollFactor;
            window.scrollTo(X, Y);
          }
          else if (barPosition[axTarget.start] < coords[axTarget.coord] && barPosition[axTarget.end] > coords[axTarget.coord]) {
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

  private onContainerScroll = () => {
    const topNode = this.scrollableParent as any;

    const scrollTop = topNode.scrollTop;
    const scrollHeight = topNode.scrollHeight;
    const clientHeight = topNode.clientHeight;

    const scrollLeft = topNode.scrollLeft;
    const scrollWidth = topNode.scrollWidth;
    const clientWidth = topNode.clientWidth;

    const isFixed = this.state.barLocation === 'fixed';

    const st: any = this.state;

    const {axis = 'vertical', targetAxis} = this.props;

    const mainScroll = extractValues(st, axis);

    this.setState({
      scrollWidth,
      scrollHeight,

      clientWidth: isFixed ? window.innerWidth : clientWidth,
      clientHeight: isFixed ? window.innerHeight : clientHeight,

      scrollLeft: isFixed ? window.scrollX : scrollLeft,
      scrollTop: isFixed ? window.scrollY : scrollTop,

      hasScroll: mainScroll.scrollSpace > mainScroll.space,
    });
  };

  private attach(parent: HTMLElement | Window) {
    this.attachParent = parent;
    parent.addEventListener('scroll', this.onContainerScroll);
  }

  private dettach() {
    if (this.attachParent) {
      this.attachParent.addEventListener('scroll', this.onContainerScroll);
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
          {scrollSpace && <Bar
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
          }
        </div>
      </StrollerStateProvider>
    );
  }
}