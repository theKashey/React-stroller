import * as React from 'react';
import {mount} from 'enzyme';
import * as ReactDom from 'react-dom/server';
import {Strollable, StrollableContainer} from '../src';

describe('Specs', () => {
  it('node Strollable', () => {
    ReactDom.renderToString(<Strollable/>);
  });

  it('node StrollableContainer', () => {
    ReactDom.renderToString(<StrollableContainer>child</StrollableContainer>);
    //expect(document).toBe(undefined);
  });

  if(typeof document !== "undefined") {
    it('node Strollable', () => {
      mount(<Strollable/>);
    });

    it('node StrollableContainer', () => {
      mount(<StrollableContainer>child</StrollableContainer>);
      //expect(document).toBe(undefined);
    });
  }
});
