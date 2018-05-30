import * as React from 'react';

import {axisToProps, axisTypes, extractValues, findScrollableParent} from "./utils";
import {BarLocation, BarSizeFunction, BarView, StollerBar, IStrollerBarProps} from "./Bar";
import {DragMachine} from "./DragEngine";

import {StrollerProvider} from './context';
import {strollerStyle} from "./Container";

export interface IStrollerProps {
  axis?: axisTypes;
  targetAxis?: axisTypes;

  bar?: BarView,
  scrollBar?: React.ComponentType<IStrollerBarProps>;
  barSizeFunction?: BarSizeFunction;

  oppositePosition?: boolean,
  draggable?: boolean

  overrideLocation?: BarLocation;
}

export interface IComponentState {
  scrollWidth: number;
  scrollHeight: number;

  clientWidth: number;
  clientHeight: number;

  scrollLeft: number;
  scrollTop: number;

  dragPhase: string;
  mousePosition: number[];

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
    barLocation: 'inside' as BarLocation
  };

  private dragMachine = DragMachine.create();

  private topNode: HTMLElement | undefined = undefined;
  private scrollableParent: HTMLElement | undefined = undefined;
  private scrollContainer: HTMLElement | null = null;
  private barRef: HTMLElement | undefined = undefined;

  componentDidMount() {
    this.scrollableParent = findScrollableParent(this.scrollContainer || this.topNode!, this.props.axis);

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
          this.setState({mousePosition: coords})
        }
        if (message === 'move') {
          const {axis = 'vertical', targetAxis: pTargetAxis} = this.props;
          const {mousePosition} = this.state;

          const targetAxis = pTargetAxis || axis;
          const axScroll = axisToProps[axis];
          const axTarget = axisToProps[targetAxis];

          const delta = [mousePosition[0] - coords[0], mousePosition[1] - coords[1]];
          const scrollableParent: any = this.scrollableParent;

          const {space: axisSpace}: { space: number } = extractValues(scrollableParent, axis);
          const {scrollSpace, space}: { scrollSpace: number, space: number } = extractValues(scrollableParent, targetAxis);

          const scrollFactor = (axisSpace / space) * scrollSpace / space;

          const barPosition: any = scrollableParent.getBoundingClientRect();
          if (this.state.barLocation === 'fixed') {
            const X = axis === 'vertical' ? window.scrollX : window.scrollX - delta[axTarget.coord] * scrollFactor;
            const Y = axis !== 'vertical' ? window.scrollY : window.scrollY - delta[axTarget.coord] * scrollFactor;
            window.scrollTo(X, Y);
          }
          else if (barPosition[axTarget.start] < coords[axTarget.coord] && barPosition[axTarget.end] > coords[axTarget.coord]) {
            scrollableParent[axScroll.scroll] -= delta[axTarget.coord] * scrollFactor;
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

    const isFixed = this.state.barLocation === 'fixed';

    this.setState({
      scrollWidth,
      scrollHeight,

      clientWidth: isFixed ? window.innerWidth : clientWidth,
      clientHeight: isFixed ? window.innerHeight : clientHeight,

      scrollLeft: isFixed ? window.scrollX : scrollLeft,
      scrollTop: isFixed ? window.scrollY : scrollTop,
    });
  };

  attach(parent: HTMLElement | Window) {
    parent.addEventListener('scroll', this.onContainerScroll);
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
      targetAxis,
      oppositePosition = false,
      draggable = false,
      barSizeFunction
    } = this.props;

    const {dragPhase} = this.state;
    const st: any = this.state;

    const ax = axisToProps[axis];

    const scrollSpace: number = st[ax.scrollSpace];

    const Bar = this.props.scrollBar || StollerBar;

    return (
      <div ref={this.setTopNode as any} style={strollerStyle}>
        <StrollerProvider value={{
          setScrollContainer: this.setScrollContainer
        }}>
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
        />
        }
      </div>
    );
  }
}