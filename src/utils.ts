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

export const findScrollableParent = (node: HTMLElement, axis: axisTypes = 'vertical'): HTMLElement => {
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