export const axisToOverflow = {
  vertical: 'overflowY',
  horizontal: 'overflowX'
};

export const axisToOverflowReverse = {
  vertical: 'overflowX',
  horizontal: 'overflowY'
};

export const axisToAxis = {
  vertical: 'Y',
  horizontal: 'X'
}

export type axisTypes = 'vertical' | 'horizontal';

export const axisToProps = {
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

export const findScrollableParent = (node: HTMLElement, axis: axisTypes = 'vertical'): HTMLElement => {
  if (node === document.body) {
    return node;
  }
  const style = window.getComputedStyle(node);
  const flow: string = style[axisToOverflow[axis] as any];
  if (flow === 'hidden' || flow === 'scroll') {
    return node;
  }
  return node.parentNode
    ? findScrollableParent(node.parentNode as any, axis)
    : node;
};

let scrollbarWidth = -1;

export const getScrollBarWidth = (): number => {
  if (scrollbarWidth < 0) {
    const outer = document.createElement('div');
    const inner = document.createElement('div');
    outer.style.overflow = 'scroll';
    document.body.appendChild(outer);
    outer.appendChild(inner);
    scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    document.body.removeChild(outer);
  }
  return scrollbarWidth;
}

export const extractValues = (set: any, axis: axisTypes) => {
  const ax = axisToProps[axis];
  const scrollSpace: number = set[ax.scrollSpace];
  const space: number = set[ax.space];
  const scroll: number = set[ax.scroll];
  return {
    scrollSpace,
    space,
    scroll
  };
}