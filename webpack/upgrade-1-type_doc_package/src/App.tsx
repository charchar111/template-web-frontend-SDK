import React from "react";
import { useState } from "react";
import Test2 from "@src/Test2";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <div>{count}</div>
      <button onClick={() => setCount((prev) => String(prev + 1))}>
        add count
      </button>
      <Test2 />
    </div>
  );
}
