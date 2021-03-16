import * as React from "react";
import { render } from "@testing-library/react";
import { Strollable, StrollableContainer } from "../src";

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
});
