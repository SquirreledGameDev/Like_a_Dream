import { useRef, useEffect, useContext, useState } from "react";
import GS from "./game_renderers/Game";
import { CurrentGameCtx } from "./managers/contexts";
import "./styles.scss";

export default function App() {
  const canvasRef = useRef();
  const [currentGame, setCurrentGame] = useContext(CurrentGameCtx);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const cnv = canvasRef.current;
    const game = new GS();
    GS.setScore = setScore;
    game._init(cnv);
  }, []);

  return (
    <>
      <div className="game">
        <canvas
          width={GS.defCnvW()}
          height={GS.defCnvH()}
          ref={canvasRef}
        ></canvas>
        <section className="bottom_bar">
          <div className="score">
            <p>Score</p>
            <p>{score}</p>
          </div>
          <div className="arrow_back"></div>
        </section>
      </div>
    </>
  );
}
