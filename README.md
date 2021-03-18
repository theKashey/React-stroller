<div align="center">
  <h1>React-S<sub>c</sub><b>t</b>roller 📜🏃‍</h1>
  <br/>
  <a href="https://circleci.com/gh/theKashey/react-stroller/tree/master">
     <img src="https://img.shields.io/circleci/project/github/theKashey/React-stroller/master.svg?style=flat-square" alt="Build status">
  </a>
  
  <a href="https://www.npmjs.com/package/react-stroller">
   <img src="https://img.shields.io/npm/v/react-stroller.svg?style=flat-square" />
  </a>
  
  <br/>  
</div>  

-----
The right page scroller - browser friendly custom draggable scrollbars.
[Demo](https://codesandbox.io/s/mm5xq5kv5y) 

# Capabilities

- ⛓display any custom scroll bar, even, well, [nyan-cat](https://github.com/theKashey/react-nyan-stroller)🐈🏳️‍🌈🏳️‍🌈🏳️‍🌈 scroll bar
- 📜 vertical and horizontal, as well as not matching main scroll axis - like displaying horizontal "reading indicator" for the vertical scroll.
- 👨‍🔬display scrollbar 1) inside 2) outside 3) at window the target scrollable
- 🤓support for "ScrollIndicators"
- 🚀support for passive scroll observation (🥳 performance)

# API
Stroller provides 4 components - to create Scrollable `container`, to draw a `scroll bar` and
to `combine` all together. The 4th component is a magic one - `StrollCaptor`.

Written in TypeScript. IDE should provide 100% prop competition.

Provides friction-less expirience, as long stroller does not hook into `onwheel` event,
observing browser scroll silently, keeping all animations smooth.

Could be used inside and outside scrollable node, autodetecting nearest scrollable parent.

```js
import {StrollableContainer} from 'react-stroller';

<BlockWithHeightSet>
  <StrollableContainer draggable>
    <UL/>
  </StrollableContainer>
</BlockWithHeightSet>
```

React-stroller consists from 3 parts:
- `Strollable` - "scrollable" container. It will remove native browser scroll.
- `Stroller` - the main component, containing all the logic
- `StrollCaptor` - component, which bypasses scrollable elements, finding the nodes to control.

`StrollableContainer` - just combines them all in the right order.

### Strollable
Is a scrollable, but __scroll-bar-less container__. It uses _padding-hack_ to hide browser scrollbars
on any system.

Read more about scroll bars here - [Scroll to the future](https://evilmartians.com/chronicles/scroll-to-the-future-modern-javascript-css-scrolling-implementations)

```js
import {Strollable} from 'react-stroller';

<div className="styleWithSizeDefined">
    <Strollable axis="horizontal | vertical" [gap]={gapFromScroll}>
     Strollable will consume 100% width/height - all the possible space 
     setup `position:relative` to the child
     and display any content inside
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
    // drop drop Scroller anywhere inside scrollable node 
    // all props are optional
    axis="horizontal | vertical"
    bar={() =><div>Your Own scroll _bar_ implementation</div>}
    scrollBar={() => <div>Your Own __scroll bar__ implementation</div>}
    oppositePosition /* if you want scroll bar on left, or top */
    draggable /* should it be draggable? */     
    barHeight={(height, scrollHeight, {dragging}) => dragging ? 42 : 24} /* you can override scroll element height */
    scrollKey={any} // key to indicate that stroller should update data (scroll height)
    passive={true} // enable passive scroll observation. Better for perf, worse for scroll synchronization
    onScroll={() => {}} // handle scroll event
  />
</div>
```
Stroller will find nearest scrollable parent, and set a scroll bar.
`bar`, you can override is just a view, an internal node for a _real_ Bar Stroller will 
draw itself. `bar` should fill 100% height and 100% width, and be just _style_. 

`scrollBar` property currently is not documented, and used only by [react-nyan-scroll](https://github.com/theKashey/react-nyan-stroller).

### StrollableContainer
Just combine all Components together in the right order
```js
import {StrollableContainer} from 'react-stroller';

<div style={{height:'100500px'}}>
    <StrollableContainer [gap]={marginFromScroller} [scrollKey]={any}>
      any content
    </StrollableContainer>
</div>
``` 

- __Do not set `overflow` property for StrollableContainer's parent__, as long it will 
set it for itself.
- Always __set height__, you can change it via `flex-grow`, or `flex-shrink`, but it has to be set.

### StrollCaptor - the secret sauce
By default Stroller could be not super smooth, as long it will be first "scrolled"
as a part of scrollable node content, and then will be moved to a new position.

It is natural to have some visual glitches and jumps, if you are not controlling wheel and emulating
scroll event as any other "custom-scroll-bar" does.

`StrollCaptor` is a fix - place it __inside__ scrollable node, while placing Stroller __outside__.
As result - on component scroll Strolled will not be moved, removing any possible _jumps_.
```js
<div style={{position:'relative'}}>
  <Stroller>
     <div style={{height:500}}>
       <StrollableContainer> // this is optional
         <StrollCaptor />
          // StrollCaptor will report to Stroller about his scrollable parent
          // which is a child for Stroller, and invisible by default.
       </StrollableContainer>
     </div>
  </Stroller>
</div>
```

### StrollerState
It's possible to create "Virtual Container", similar to `react-window`, using React-Strollable.

Stroller will expose internal state via `StrollerState` component, you can _consume_ and then react
to scroll or resize.
```js
<StrollableContainer>
  <StrollerState>
   {({
     scrollWidth: number,
     scrollHeight: number,
   
     clientWidth: number,
     clientHeight: number,
   
     scrollLeft: number,
     scrollTop: number,
   }) => (
     // render elements based on visibility.
   )}
  </StrollerState>
</StrollableContainer>
```

## ScrollIndicators
Just read stroller state and display them
```js
import {StrollerState} from 'react-stroller';
export const VerticalScrollIndicator= () => (
  <StrollerState>
    {({scrollTop, scrollHeight, clientHeight}) => (
      <>
        <span          
          className={cx(
            styles['indicator--top'],            
            scrollTop === 0 && styles['indicator--hidden']
          )}
        />
        <span
          className={cx(
            styles['indicator--bottom'],
            scrollTop + clientHeight >= scrollHeight && styles['indicator--hidden']
          )}
        />
      </>
    )}
  </StrollerState>
);
```

## Separated scrollbar
You might display scrollbar in the parent, while observing scroll at the children
```js
<Stroller> // "Bar" would be displayed on this level
  any code
  <DivWithKnownHeight> // we are "observing" scroll in this node
    <Strollable> 
      <StrollCaptor/>
        {children}
    </Strollable>
    <VerticalScrollIndicator/>
  </DivWithKnownHeight>
  any code
</Stroller>            
```

## Testing
React-stroller is a library, which could not be unit tested. Things like smooth scroll, right overflows and
 touch-n-feel experience are not something robot could test.   
Tested manually and carefully by a human being. 

Uses TypeScript and a finite state machine(Faste) underneath, for a better confidence.

# See also

[React-Locky](https://github.com/theKashey/react-locky) - gather a full control under your scroll.

[React-focus-lock](https://github.com/theKashey/react-focus-lock) - scope your focus in browser friendly way.

# Licence 
MIT
