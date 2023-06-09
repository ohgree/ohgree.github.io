import { useState } from "react";

import { Button, DatePicker, Space, version } from "antd";

import reactLogo from "./asset/react.svg";
import viteLogo from "./asset/vite.svg";
import { CharacterCounter } from "./component/CharacterCounter";

import "./App.css";

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />{" "}
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />{" "}
        </a>
      </div>
      <h1>Vite + React</h1>
      <h1>antd version: {version}</h1>
      <Space>
        <DatePicker></DatePicker>
        <Button type="primary">Primary Button</Button>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <CharacterCounter />
      </Space>
    </div>
  );
};

export default App;
