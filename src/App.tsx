import React from "react";
import { useState } from "react";
import Test from "@src/Test";
import Test2 from "./Test2";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      Appasdsa
      <Test />
      <Test2 />
    </div>
  );
}
