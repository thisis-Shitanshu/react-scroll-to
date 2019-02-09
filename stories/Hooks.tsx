import React from "react";
import { ScrollStory } from ".";
import { useScrollTo } from "../src";

function ScrollButton() {
  const { scrollTo } = useScrollTo();

  return (
    <button onClick={() => scrollTo({ y: window.innerHeight, smooth: true })}>
      Click Me
    </button>
  );
}

ScrollStory.add("Hooks", () => (
  <div
    style={{
      height: "150vh",
      position: "relative",
      padding: 20,
      backgroundImage: "linear-gradient(#FFF, #111)"
    }}
  >
    <ScrollButton />
  </div>
));
