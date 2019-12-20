import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { ChildComponent } from "./ChildComponent";

const App: React.FC = () => {
  const [count, setCount] = useState(0);
  const handleClick = () => setCount(count + 1);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div id="count-disp">count: {count}</div>
        <ChildComponent
          handleMount={() => console.log("Parent: mount")}
          handleUnmount={() => console.log("Parent: unmount")}
          handleUpdate={handleClick}
          handleUpdated={() => console.log("Parent: updated")}
          count={count}
        />
      </header>
    </div>
  );
};

export default App;
