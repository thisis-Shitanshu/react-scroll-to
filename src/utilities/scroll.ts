import React from "react";
import ReactDOM from "react-dom";

export function scrollNode(node, options) {
  if (!node) {
    return;
  }

  const top = parseLocation(options.y, node, true);
  const left = parseLocation(options.x, node, false);

  /* istanbul ignore next */
  if (React.isValidElement(node)) {
    /* istanbul ignore next */
    const rNode = ReactDOM.findDOMNode(node as any);

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
}

export function parseLocation(parameter, node, isHorizontal) {
  if (typeof parameter !== "function") {
    return parameter;
  }

  return parameter(node, isHorizontal);
}
