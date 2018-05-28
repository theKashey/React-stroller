import * as React from 'react';
import {mount} from 'enzyme';
import {Strollable} from '../src';

describe('Specs', () => {
  it('smoke', () => {
    mount(<Strollable/>);
  });
});
