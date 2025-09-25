import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById("react-root");
if (!container) throw new Error("컨테이너를 찾을 수 없습니다.");
const root = createRoot(container);

root.render(<App />);
