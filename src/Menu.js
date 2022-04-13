import React, { useContext } from "react";
import { MenuStateCtx } from "./managers/contexts";
import GameBuilder from "./GameBuilder";

export default function Menu() {
  const [MenuState, setMenuState] = useContext(MenuStateCtx);
  return (
    <>
      <GameBuilder />
    </>
  );
}
