import * as React from 'react';
import styled from 'styled-components';
import {AppWrapper} from './styled';

import {Stroller} from "../src/Stroller";
import {Strollable} from "../src";
import {StrollCaptor} from "../src/StrollCaptor";
import {StrollableContainer} from "../src/StrollableContainer";

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

export default class App extends React.Component <{}, AppState> {
  state: AppState = {}

  render() {
    return (
      <AppWrapper>
        Simple
        <Block>
          <Scrollable axis="vertical">
            <UL/>
            <div>
              {/*<UL/>*/}
              <Stroller axis="vertical"/>
            </div>
          </Scrollable>
        </Block>
        <hr/>
        Outer
        <Block>
          <Stroller axis="vertical" draggable>
            <Block>
              <Scrollable axis="vertical">
                <UL/>
                <div>
                  {/*<UL/>*/}
                  <StrollCaptor/>
                </div>
              </Scrollable>
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
          <Scrollable axis="vertical">
            <UL/>
            <div>
              {/*<UL/>*/}
              <Stroller axis="vertical" oppositePosition draggable/>
            </div>
          </Scrollable>
        </Block>
        <hr/>
        Custom Bar
        <Block>
          <Scrollable axis="vertical">
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
          </Scrollable>
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
      </AppWrapper>
    )
  }
}