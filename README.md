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
    // all props are optional
    axis="horizontal | vertical"
    bar={() =><div>Your Own scroll bar implimentation</div>}
    oppositePosition /* if you want scroll bar on left, or top */
    draggable /* should it be draggable? */     
    barHeight={(height, scrollHeight, {dragging}) => dragging ? 42 : 24} /* you can override scroll element height */
  />
</div>
```
Stroller will find nearest scrollable parent, and set a scroll bar.
`bar`, you can override is just a view, an internal node for a _real_ Bar Stroller will 
draw itself. `bar` should fill 100% height and 100% width, and be just _style_. 

### ScrollableContainer
Just combine both Components together 

# Licence 
MIT