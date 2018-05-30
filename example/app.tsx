import * as React from 'react';
import styled from 'styled-components';
import {AppWrapper} from './styled';

import {Stroller} from "../src/Stroller";
import {Strollable} from "../src";
import {StrollCaptor} from "../src/StrollCaptor";
import {StrollableContainer} from "../src/StrollableContainer";
import {BarView, StrollerBarProps} from "../src/Bar";

export interface AppState {

}

const Block = styled.div`
  height: 200px;  
  width: 800px;
  background-color:#f0f0f0;
  position: relative;
`;

const LongLi = styled.div`
  display: flex;
  flex-direction:row;
  ul {
    display:flex;
  }
  li {
    padding:5px;
  }
`;

const UL = () => (
  <ul>
    {(Array(50) as any)
      .fill(1)
      .map((_: any, index: number) => <li key={`k${index}`}>{index}</li>)
    }
  </ul>
)

const Bar = styled.div`
  width:8px;
  height:8px;
  border-radius:8px;
  align-self: center;
  background-color: #F00;
  
  transition-property: transform;
  transition-duration: 300ms;
  
  transform-origin: 100% 50%;
  
  &:hover {
    transform: scale(1.5);  
  }
  
  ${(props: any) => props.dragging && `
    && {transform: scale(2);}   
  `}
`;

const NyanCatH = styled.div`
  width: 26px;
  height: 16px;
  background-image: url('cat.gif');
  background-size: contain;
  background-repeat: no-repeat;
`;

const NyanCatV = styled.div`
  width: 26px;
  height: 16px;
  background-image: url('cat.gif');
  background-repeat: no-repeat;
  background-size: contain;
  transform: rotate(-90deg);
  transform-origin: 100% 0%;
`;

const NyanRainbowH = styled.div`
  width: 100%;
  height: 100%;
  background-image:linear-gradient(0deg, transparent, magenta, red, yellow, limegreen, turquoise, blue, magenta, transparent);
  background-position: -16px center;
  background-repeat: no-repeat;
  background-size: contain;
`

const NyanRainbowV = styled.div`
  width: 100%;
  height: 100%;
  background-image:linear-gradient(90deg, transparent, magenta, red, yellow, limegreen, turquoise, blue, magenta, transparent);
  background-position: center 0;
  background-repeat: no-repeat;
  background-size: contain;
`

const NyanHolderH = styled.div`
  height: 16px;
`;

const NyanHolderV = styled.div`
  width: 16px;
`;

const NyanPositionerH = styled.div`
  position:absolute;
  bottom: 0;
  right: 0;
  width: 26px;
  height: 16px;
`;

const NyanPositionerV = styled.div`
  position:absolute;
  bottom:0;
  right:0;
  width: 16px;
  height: 26px;
`;

const NyanTopHolder: React.SFC<{ style: any }> = styled.div`
  position:fixed;
  bottom:0;
  left:0;
  right:${(props: any) => props.right};
` as any;

const NuanCarBar: React.SFC<StrollerBarProps> = ({
                                                   scroll,
                                                   scrollSpace,
                                                   space,
                                                   forwardRef,
                                                 }) => {
  const usableSpace = window.innerWidth;
  const right = usableSpace * scroll / (scrollSpace - window.innerHeight);
  return (
    <NyanTopHolder style={{width: Math.round(right) + 'px'}}>
      <NyanHolderH>
        <NyanRainbowH/>
        <NyanPositionerH>
          <div ref={forwardRef as any}>
            <NyanCatH/>
          </div>
        </NyanPositionerH>
      </NyanHolderH>
    </NyanTopHolder>
  );
}

const NyanBar = () => (
  <Stroller draggable axis="vertical" targetAxis="horizontal" overrideLocation="fixed" scrollBar={NuanCarBar}/>
)

export default class App extends React.Component <{}, AppState> {
  state: AppState = {}

  render() {
    return (
      <AppWrapper>
        <Strollable axis="vertical">
          <Stroller axis="vertical" overrideLocation="fixed"/>
          <NyanBar/>
          <UL/>
          <UL/>

          Simple
          <Block>
            <Strollable axis="vertical">
              <UL/>
              <div>
                {/*<UL/>*/}
                <Stroller axis="vertical"/>
              </div>
            </Strollable>
          </Block>
          <hr/>
          {0 && <div>
            Outer
            <Block>
              <Stroller axis="vertical" draggable>
                <Block>
                  <Strollable axis="vertical">
                    <UL/>
                    <div>
                      {/*<UL/>*/}
                      <StrollCaptor/>
                    </div>
                  </Strollable>
                </Block>
              </Stroller>
            </Block>
            <hr/>
            Container
            <Block>
              <StrollableContainer axis="vertical" draggable>
                <UL/>
              </StrollableContainer>
            </Block>
            <hr/>
            Draggable
            <Block>
              <Strollable axis="vertical">
                <UL/>
                <div>
                  {/*<UL/>*/}
                  <Stroller axis="vertical" oppositePosition draggable/>
                </div>
              </Strollable>
            </Block>
            <hr/>
            Custom Bar
            <Block>
              <Strollable axis="vertical">
                <UL/>
                <div>
                  {/*<UL/>*/}
                  <Stroller
                    axis="vertical"
                    bar={Bar}
                    barSizeFunction={(_1, _2, {dragging}) => dragging ? 16 : 8}
                    draggable
                  />
                </div>
              </Strollable>
            </Block>
            <hr/>
            In hidden block
            <Block>
              <div style={{position: 'relative', overflow: 'hidden', height: '200px'}}>
                <UL/>
                <div>
                  {/*<UL/>*/}
                  <Stroller axis="vertical" draggable/>
                </div>
              </div>
            </Block>
            <hr/>
            Horizontal
            <Block>
              <StrollableContainer axis="horizontal" draggable oppositePosition>
                <LongLi>
                  <UL/>
                  <UL/>
                  <UL/>
                </LongLi>
              </StrollableContainer>
            </Block>
            <hr/>
          </div>
          }
        </Strollable>
      </AppWrapper>
    )
  }
}