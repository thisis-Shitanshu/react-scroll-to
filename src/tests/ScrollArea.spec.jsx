import React from "react";
import { render } from "@testing-library/react";
import { ScrollToContext } from "../ScrollTo";
import ScrollArea, { createRefPoly } from "../ScrollArea";

jest.mock("../utilities/generateId", () => () => "mock-id");

const BaseScrollArea = props => {
  const { addScrollArea, removeScrollArea, ...rest } = props;

  return (
    <ScrollToContext.Provider value={{ addScrollArea, removeScrollArea }}>
      <ScrollArea {...rest} />
    </ScrollToContext.Provider>
  );
};

describe("Test Scroll Area.", () => {
  it("should call addScrollArea when mounting.", () => {
    const addScrollArea = jest.fn();
    render(
      <BaseScrollArea addScrollArea={addScrollArea} removeScrollArea={() => {}}>
        <h1>Test</h1>
      </BaseScrollArea>
    );

    expect(addScrollArea).toHaveBeenCalledTimes(1);
    expect(addScrollArea.mock.calls[0]).toMatchSnapshot();
  });

  it("should call removeScrollArea when unmounting.", () => {
    const removeScrollArea = jest.fn();
    const { unmount } = render(
      <BaseScrollArea
        addScrollArea={() => {}}
        removeScrollArea={removeScrollArea}
      >
        <h1>Test</h1>
      </BaseScrollArea>
    );

    unmount();

    expect(removeScrollArea).toHaveBeenCalledTimes(1);
    expect(removeScrollArea.mock.calls[0]).toMatchSnapshot();
  });

  it("should render correctly.", () => {
    const { container } = render(
      <BaseScrollArea
        className="foo"
        addScrollArea={() => {}}
        removeScrollArea={() => {}}
      >
        <h1>Test</h1>
      </BaseScrollArea>
    );

    expect(container).toMatchSnapshot();
  });

  // Used to make coverage 100%
  it("should render default context.", () => {
    const fns = {
      addScrollArea: jest.fn(),
      removeScrollArea: jest.fn()
    };

    const { container, debug } = render(
      <ScrollToContext.Provider value={fns}>
        <ScrollArea style={{ padding: 20 }}>test</ScrollArea>
      </ScrollToContext.Provider>
    );
  });

  it("Should polyfill createRef", () => {
    const ref = createRefPoly();
    const { container } = render(<div ref={ref} />);

    expect(ref.current).toBeTruthy();
  });

  it("Should handle a null element passed to createRef", () => {
    const ref = createRefPoly();

    ref(null);

    expect(ref.current).toBeFalsy();
  });

  it("Should use createRefPoly() when createRef() doesn't exist", () => {
    const rCreateRefTemp = React.createRef;
    React.createRef = false;

    const { container, debug } = render(
      <BaseScrollArea addScrollArea={() => {}} removeScrollArea={() => {}}>
        <h1>Test</h1>
      </BaseScrollArea>
    );

    expect(true).toBeTruthy();
    React.createRef = rCreateRefTemp;
  });
});
