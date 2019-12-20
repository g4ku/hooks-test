import React, { useEffect } from "react";

export type ChildProps = {
  handleMount: () => void;
  handleUnmount: () => void;
  handleUpdate: () => void;
  handleUpdated: () => void;
  count: number;
};

export const ChildComponent: React.FC<ChildProps> = props => {
  useEffect(() => {
    console.log("mount!");
    props.handleMount();

    return () => {
      console.log("unmount!");
      props.handleUnmount();
    };
  }, []);
  useEffect(() => {
    console.log(`count changed: ${props.count}`);
    document.title = `count changed: ${props.count}`;
    props.handleUpdated();
  }, [props.count]);

  return (
    <div>
      <button id="update-button" onClick={props.handleUpdate}>
        Update!
      </button>
      <Foo />
    </div>
  );
};

export const Foo: React.FC = props => {
  return <div id="foo">Foo!</div>;
};
