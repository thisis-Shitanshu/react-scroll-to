import React, { Component } from "react";
import createReactContext from "create-react-context";
import { relative } from "./utilities/relative";
import { scrollNode } from "./utilities/scroll";
import { IScrollProps } from "./definitions/ScrollTo";

interface IProps {
  children: (args: {
    scrollTo: (props: Partial<IScrollProps>) => void;
    relative: (
      value: number
    ) => (
      node:
        | React.RefObject<any>
        | Component
        | HTMLElement
        | HTMLDocument
        | Window,
      isHorizontal: boolean
    ) => number;
  }) => React.ReactNode;
}

/* istanbul ignore next */
export const ScrollToContext = React.createContext
  ? React.createContext({}) /* istanbul ignore next */
  : createReactContext({});

/**
 * Component that uses render props to inject
 * a function that allows the consumer to scroll to a
 * position in the window or ScrollArea component
 */
export default class ScrollTo extends Component<IProps> {
  private scrollArea;
  private getContext;

  constructor(props) {
    super(props);

    this.scrollArea = {};

    this.getContext = {
      addScrollArea: (id, ref) => {
        this.scrollArea[id] = ref;
      },
      removeScrollArea: id => {
        delete this.scrollArea[id];
      }
    };
  }

  handleScroll = (props: Partial<IScrollProps> = {}) => {
    const scrollAreaKeys = Object.keys(this.scrollArea);
    const { id, ref, ...rest } = props as IScrollProps;

    if (ref) {
      const refNode = ref.current ? ref.current : ref;

      // Scroll by ref
      scrollNode(refNode, rest);
    } else if (id) {
      // Scroll by id
      const node = this.scrollArea[id];

      scrollNode(node, rest);
    } else if (scrollAreaKeys.length > 0) {
      // Scroll by all scroll areas
      scrollAreaKeys.forEach(key => {
        const node = this.scrollArea[key];

        scrollNode(node, rest);
      });
    } else {
      // Scroll by window
      scrollNode(window, rest);
    }
  };

  render() {
    return (
      <ScrollToContext.Provider value={this.getContext}>
        {this.props.children &&
          this.props.children({
            scrollTo: this.handleScroll,
            relative
          })}
      </ScrollToContext.Provider>
    );
  }
}
