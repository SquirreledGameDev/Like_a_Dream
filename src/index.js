import { StrictMode } from "react";
import Contexts from "./managers/contexts";
import ReactDOM from "react-dom";

import Menu from "./Menu";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <Contexts>
      <Menu />
    </Contexts>
  </StrictMode>,
  rootElement
);
