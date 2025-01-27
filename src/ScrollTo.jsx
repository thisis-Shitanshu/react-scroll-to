import React, { Component, isValidElement } from "react";
import ReactDOM from "react-dom";
import { relative } from "./utilities/relative";

/* istanbul ignore next */
export const ScrollToContext = React.createContext({});

/**
 * Component that uses render props to inject
 * a function that allows the consumer to scroll to a
 * position in the window or ScrollArea component
 */
class ScrollTo extends Component {
  constructor(props) {
    super(props);

    this.scrollArea = {};

    this.getContext = {
      addScrollArea: this.addScrollArea,
      removeScrollArea: this.removeScrollArea
    };
  }

  /* istanbul ignore next */
  addScrollArea = (id, ref) => {
    this.scrollArea[id] = ref;
  };

  /* istanbul ignore next */
  removeScrollArea = id => {
    delete this.scrollArea[id];
  };

  handleScroll = (props = {}) => {
    const scrollAreaKeys = Object.keys(this.scrollArea);
    const { id, ref, ...rest } = props;

    if (ref) {
      const refNode = ref.current ? ref.current : ref;

      // Scroll by ref
      this._scrollNode(refNode, rest);
    } else if (id) {
      // Scroll by id
      const node = this.scrollArea[id];

      this._scrollNode(node, rest);
    } /* istanbul ignore next */ else if (scrollAreaKeys.length > 0) {
      // Scroll by all scroll areas
      /* istanbul ignore next */
      scrollAreaKeys.forEach(key => {
        const node = this.scrollArea[key];

        this._scrollNode(node, rest);
      });
    } else {
      // Scroll by window
      this._scrollNode(window, rest);
    }
  };

  _scrollNode = (node, options) => {
    if (!node) {
      return;
    }

    const top = ScrollTo._parseLocation(options.y, node, true);
    const left = ScrollTo._parseLocation(options.x, node, false);

    /* istanbul ignore next */
    if (isValidElement(node)) {
      /* istanbul ignore next */
      const rNode = ReactDOM.findDOMNode(node);

      /* istanbul ignore next */
      if (rNode) {
        node = rNode;
      }
    }

    if (node.scrollTo) {
      node.scrollTo({
        top,
        left,
        behavior: options.smooth ? "smooth" : "auto"
      });
    } else {
      node.scrollLeft = left;
      node.scrollTop = top;
    }
  };

  static _parseLocation = (parameter, node, isHorizontal) => {
    if (typeof parameter !== "function") {
      return parameter;
    }

    return parameter(node, isHorizontal);
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

ScrollTo.defaultProps = {
  children: () => {}
};

export default ScrollTo;
