import { createContext, useState } from "react";

const MenuStateCtx = createContext("menu");
const CurrentGameCtx = createContext();

const MenuState = ({ children }) => {
  const state = useState("menu");
  return (
    <MenuStateCtx.Provider value={state}>{children}</MenuStateCtx.Provider>
  );
};

const CurrentGame = ({ children }) => {
  const state = useState();
  return (
    <CurrentGameCtx.Provider value={state}>{children}</CurrentGameCtx.Provider>
  );
};

const ContextCombiner = ({ children }) => {
  return (
    <MenuState>
      <CurrentGame>{children}</CurrentGame>
    </MenuState>
  );
};
export default ContextCombiner;
export { MenuStateCtx, CurrentGameCtx };
