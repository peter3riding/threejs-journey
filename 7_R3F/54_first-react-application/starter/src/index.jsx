import App from "./App";
import "./style.css";
import { createRoot } from "react-dom/client";

const root = createRoot(document.querySelector("#root"));

root.render(
  <div>
    <App clickersCount={4}>
      <h1>My First React App</h1>
      <h2>And a fancy subtitle</h2>
    </App>
  </div>,
);
