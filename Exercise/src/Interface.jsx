import React, { useEffect, useRef } from "react";
import { useKeyboardControls } from "@react-three/drei";
import useGame from "./stores/useGame";
import { addEffect } from "@react-three/fiber";

const Interface = () => {
  const time = useRef();

  const forward = useKeyboardControls((state) => state.forward);
  const right = useKeyboardControls((state) => state.right);
  const left = useKeyboardControls((state) => state.left);
  const backward = useKeyboardControls((state) => state.backward);
  const jump = useKeyboardControls((state) => state.jump);

  const restart = useGame((state) => state.restart);
  const highScore = useGame((state) => state.highScore);
  const setHighScore = useGame((state) => state.setHighScore);

  const formatTime = (n) => n.toFixed(3) / 1000;

  useEffect(() => {
    // Access to useFrame from outside the canvas
    const unsubsribe = addEffect(() => {
      // get state in a non reactive way so it updates(since addEffect only subscribes on first render so states above are no updated)
      const state = useGame.getState();

      let elapsedTime = 0.0;
      elapsedTime.toFixed(3);

      if (state.phase === "playing") {
        elapsedTime = Date.now() - state.startTime;
      } else if (state.phase === "ended") {
        elapsedTime = state.endTime - state.startTime;
        // set highscore
        if (state.highScore === 0) setHighScore(formatTime(elapsedTime));
        else if (formatTime(elapsedTime) < state.highScore) {
          setHighScore(formatTime(elapsedTime));
        }
      }

      // update time reference
      if (time.current) {
        time.current.textContent = formatTime(elapsedTime);
      }
    });

    return () => unsubsribe();
  }, []);

  return (
    <>
      <div className="interface"></div>
      <div ref={time} className="time"></div>
      <div className="restart" onClick={restart}>
        restart
      </div>
      <div className="highScore">{highScore === 0 ? "" : highScore}</div>

      <div className="controls">
        <div className="raw">
          <div className={`key ${forward ? "active" : ""}`}>w</div>
        </div>
        <div className="raw">
          <div className={`key ${left ? "active" : ""}`}>a</div>
          <div className={`key ${backward ? "active" : ""}`}>s</div>
          <div className={`key ${right ? "active" : ""}`}>d</div>
        </div>
        <div className="raw">
          <div className={`key large ${jump ? "active" : ""}`}>space</div>
        </div>
      </div>
    </>
  );
};

export default Interface;
