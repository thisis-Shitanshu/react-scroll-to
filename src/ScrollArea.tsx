import React from "react";
import { ScrollToContext } from "./ScrollTo";
import generateId from "./utilities/generateId";

interface IProps {
  id?: string;
  style?: {};
  addScrollArea: (id: string, node: any) => void;
  removeScrollArea: (id: string) => void;
}

export function createRefPoly() {
  function ref(instanceOrNode) {
    ref.current = instanceOrNode || null;
  }

  ref.current = null;

  return ref;
}

export class ScrollArea extends React.Component<IProps> {
  // Using React.createRef so we can easily unit test this
  node = React.createRef ? React.createRef() : createRefPoly();

  id = this.props.id || generateId();

  componentDidMount() {
    this.props.addScrollArea(this.id, this.node.current);
  }

  componentWillUnmount() {
    this.props.removeScrollArea(this.id);
  }

  render() {
    const { children, removeScrollArea, addScrollArea, ...props } = this.props;

    return (
      <div {...props} ref={this.node as any}>
        {children}
      </div>
    );
  }
}

const Consumer = ScrollToContext.Consumer as any;

export default (props: Pick<IProps, "id"> | { style?: {}; children: any }) => (
  <Consumer>
    {({ addScrollArea, removeScrollArea }) => (
      <ScrollArea
        {...props}
        removeScrollArea={removeScrollArea}
        addScrollArea={addScrollArea}
      />
    )}
  </Consumer>
);
