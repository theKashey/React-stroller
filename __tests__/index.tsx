import * as React from "react";
import { render, fireEvent } from "@testing-library/react";
import { Strollable, StrollableContainer } from "../src";
import {findScrollableParent} from "../src/utils";

describe("Strollable", () => {
  it("should render correctly", () => {
    const { container } = render(<Strollable />);

    expect(container).toMatchSnapshot();
  });
});


describe("StrollableContainer", () => {
  it("should render correctly", () => {
    const { container } = render(
      <StrollableContainer>child</StrollableContainer>
    );

    expect(container).toMatchSnapshot();
  });

  it("should handle scroll", () => {
    const mockOnScroll = jest.fn();
    const { getByTestId } = render(
      <StrollableContainer onScroll={mockOnScroll} ><div data-testid="child">inner</div></StrollableContainer>
    );

    expect(mockOnScroll).toHaveBeenCalledTimes(0);

    const child = getByTestId('child');
    fireEvent.scroll(findScrollableParent(child), { target: { scrollY: 100 } })

    expect(mockOnScroll).toHaveBeenCalledTimes(1);
  })
});
