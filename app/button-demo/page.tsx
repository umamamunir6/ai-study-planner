"use client";

import { useState } from "react";
import BrainButton from "../components/BrainButton";

type ButtonState = "idle" | "loading" | "success" | "error";

export default function ButtonDemo() {
  const [forceState, setForceState] = useState<
    "success" | "error" | null
  >(null);

  const [currentState, setCurrentState] =
    useState<ButtonState>("idle");

  const triggerState = (state: "success" | "error") => {
    setForceState(null);

    setTimeout(() => {
      setForceState(state);
    }, 20);
  };

  return (
    <main className="button-demo">
      <div className="button-demo-card">

        <h1>Buttons with a Brain</h1>

        <p className="demo-description">
          A state-aware AI Study Planner button with intentional
          motion and feedback.
        </p>

        <div className="brain-button-wrapper">
          <BrainButton
            forceState={forceState}
            onStateChange={setCurrentState}
          />
        </div>

        <div className="demo-controls">
          <button
            type="button"
            onClick={() => triggerState("success")}
            disabled={currentState === "loading"}
          >
            Force Success
          </button>

          <button
            type="button"
            onClick={() => triggerState("error")}
            disabled={currentState === "loading"}
          >
            Force Error
          </button>
        </div>

        <div className="state-display">
          Current state: <strong>{currentState}</strong>
        </div>

        <div className="motion-note">
          <strong>Motion choices</strong>

          <p>
            Hover and press interactions use 180ms ease-out
            transitions for responsive feedback. State changes use
            180–220ms opacity and transform transitions to avoid
            abrupt swaps and layout movement. Success uses a short
            300ms pop, while error uses a 350ms shake. Under
            prefers-reduced-motion, movement is removed while
            colors, labels, and icons continue to communicate state.
          </p>
        </div>
      </div>
    </main>
  );
}