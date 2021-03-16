import * as React from 'react';
import { render } from '@testing-library/react';
import {Strollable, StrollableContainer} from '../src';

describe('Should render correctly', () => {
  it('Strollable', () => {
    const { container } = render(<Strollable/>);

    expect(container).toMatchSnapshot();
  });

  it('StrollableContainer', () => {
   const { container } = render(<StrollableContainer>child</StrollableContainer>);
      expect(container).toMatchSnapshot();
  });
});
