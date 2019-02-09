import React from "react";
import { IScrollProps } from "./definitions/ScrollTo";
import { scrollNode } from "./utilities/scroll";

export function useScrollTo() {
  return {
    scrollTo(options: Partial<IScrollProps>) {
      scrollNode(window, options);
    }
  };
}
