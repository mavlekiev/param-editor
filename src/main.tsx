import React from "react";
import ReactDOM from "react-dom/client";
import { ParamEditor } from "./ParamEditor";

const params = [
  { id: 1, name: "Назначение", type: "string" as const },
  { id: 2, name: "Длина", type: "string" as const },
];

const model = {
  paramValues: [
    { paramId: 1, value: "повседневное" },
    { paramId: 2, value: "макси" },
  ],
  colors: [{ id: 1, name: "Черный" }],
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ParamEditor params={params} model={model} />
  </React.StrictMode>,
);
