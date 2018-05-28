<div align="center">
  <h1>React-S<sub>c</sub><b>t</b>roller 📜🏃‍</h1>
  <br/>
  <a href="https://circleci.com/gh/theKashey/react-stroller/tree/master">
     <img src="https://img.shields.io/circleci/project/github/theKashey/react-stroller/master.svg?style=flat-square)" alt="Build status">
  </a>
  
  <a href="https://www.npmjs.com/package/react-stroller">
   <img src="https://img.shields.io/npm/v/react-stroller.svg?style=flat-square" />
  </a>
  
  <br/>  
</div>  

-----
The right page scroller - browser friendly custom draggable scrollbars .

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
</Block>
```

### Strollable
Is a scrollable, but __scroll-bar-less container__. It uses _padding-hack_ to hide browser scrollbars
on any system.

Read more about scroll bars here - [Scroll to the future](https://evilmartians.com/chronicles/scroll-to-the-future-modern-javascript-css-scrolling-implementations)

```js
import {Strollable} from 'react-stroller';

<div className="styleWithSizeDefined">
    <Strollable axis="horizontal | vertical">
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

### StrollableContainer
Just combine all Components together in the right order
```js
import {StrollableContainer} from 'react-stroller';

<div style={{height:'100500px'}}>
    <StrollableContainer>
      any content
    </StrollableContainer>
</div>
``` 

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