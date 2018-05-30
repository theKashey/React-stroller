import {AnyHookCallback, faste, HookCallback, Faste, InternalMachine, MessageHandler} from 'faste';

export {
  Faste,
  InternalMachine,
  MessageHandler
};

const nodeHook: AnyHookCallback = {
  on: ({attrs, trigger, message}) => {
    const hook = (event: any) => {
      trigger(message, event);
      event.preventDefault();
    };
    attrs.node.addEventListener(message, hook);
    return [attrs.node, hook]
  },
  off: ({message}, [node, hook]) => {
    node.removeEventListener(message, hook)
  }
};

const documentHook: HookCallback<any, any, any> = {
  on: ({trigger, message}) => {
    const hook = (event: any) => {
      trigger(message, event);
      event.preventDefault();
    };
    document.addEventListener(message, hook, true);
    return hook
  },
  off: ({message}, hook) => {
    document.removeEventListener(message, hook, true)
  }
};

const getCoords = (event: MouseEvent | Touch) => [event.clientX, event.clientY];

export const DragMachine = faste()
  .withPhases(['init', 'disabled', 'idle', 'dragging', 'cancelDrag'])
  .withAttrs<{ node?: HTMLElement, enabled?: boolean }>({})
  .withMessages(['check', 'down', 'up', 'move', 'mousedown', 'mouseup', 'mousemove', 'touchstart', 'touchmove', 'touchend'])
  .withSignals(['up', 'down', 'move'])

  .on('check', ['init', 'disabled'], ({attrs, transitTo}) => attrs.enabled && attrs.node && transitTo('idle'))
  .on('check', ['idle', 'dragging'], ({attrs, transitTo}) => (!attrs.enabled || !attrs.node) && transitTo('disabled'))

  // outer reactions
  .on('down', ({transitTo, emit}, event) => {
    emit('down', event);
    transitTo('dragging')
  })
  .on('up', ({transitTo}) => transitTo('idle'))
  .on('move', ({emit}, event) => emit('move', event))
  .on('@enter', ['cancelDrag'], ({transitTo}) => transitTo('idle'))

  // mouse events
  .on('mousedown', ['idle'], ({trigger}, event: MouseEvent) => trigger('down', getCoords(event)))
  .on('mouseup', ['dragging'], ({trigger}) => trigger('up'))
  .on('mousemove', ['dragging'], ({transitTo}, event: MouseEvent) => event.buttons !== 1 && transitTo('cancelDrag'))
  .on('mousemove', ['dragging'], ({trigger}, event: MouseEvent) => trigger('move', getCoords(event)))

  // touch events
  .on('touchstart', ['idle'], ({trigger}, event: TouchEvent) => trigger('down', getCoords(event.touches[0])))
  .on('touchend', ['dragging'], ({trigger}) => trigger('up'))
  .on('touchmove', ['dragging'], ({trigger}, event: TouchEvent) => trigger('move', getCoords(event.touches[0])))

  .hooks({
    mousedown: nodeHook,
    mouseup: documentHook,
    mousemove: documentHook,

    touchstart: nodeHook,
    touchmove: documentHook,
    touchend: documentHook,
  });