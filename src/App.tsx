import React from "react";
import { useState } from "react";
import Test from "./Test";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      App
      <Test />
    </div>
  );
}
