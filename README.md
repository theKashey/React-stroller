# React-stroller
-----
The right page scroller


# API
Stroller provides 3 components - to create Scrollable `container`, to draw a `scroll bar` and
to `combine` all together.

Written in TypeScript. IDE should provide 100% prop competition.

### Strollable
Is a scrollable, but scroll-bar-less container. It uses _padding-hack_ to hide browser scrollbars
on any system.

```js
import {Strollable} from 'react-stroller';

<div className="styleWithSizeDefined">
    <Strollable axis="horizontal | vertical">
    // Strollable will consume all 100% width/height
      any content
    </Strollable> 
</div>
```

### Stroller
Stroller is a React-scrollbar. It observes `scroll` event, and position itself where it should be.
Stroller likes to be placed inside Strollable.

Meanwhile could be used to scroll "unscrollable"(unwheelable) containers.
```js
import {Stroller} from 'react-stroller';

<div style={{ position:'relative', overflow: 'hidden'}}>
  <Stroller
    axis="horizontal | vertical"
    bar={() =><div>Your Own scroll bar implimentation</div>}
    oppositePosition /* if you want scroll bar on left, or top */
    draggable /* should it be draggable? */ 
    barOffset={0} /* the "right" offset */
  />
</div>
```

### ScrollableContainer
Just combine both Components together 

# Licence 
MIT