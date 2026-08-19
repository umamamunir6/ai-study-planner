"use client";

import { useEffect, useState } from "react";

type ButtonState = "idle" | "loading" | "success" | "error";

type BrainButtonProps = {
  forceState?: "success" | "error" | null;
  onStateChange?: (state: ButtonState) => void;
};

export default function BrainButton({
  forceState,
  onStateChange,
}: BrainButtonProps) {
  const [state, setState] = useState<ButtonState>("idle");

  const updateState = (nextState: ButtonState) => {
    setState(nextState);
    onStateChange?.(nextState);
  };

  const runAction = async (force?: "success" | "error") => {
    if (state === "loading") return;

    updateState("loading");

    const delay = 800 + Math.random() * 1200;

    await new Promise((resolve) => setTimeout(resolve, delay));

    const failed = force === "error" || (!force && Math.random() < 0.2);

    updateState(failed ? "error" : "success");

    setTimeout(() => {
      updateState("idle");
    }, 1500);
  };

  useEffect(() => {
    if (!forceState || state === "loading") return;

    updateState("loading");

    const timer = setTimeout(() => {
      updateState(forceState);

      setTimeout(() => {
        updateState("idle");
      }, 1500);
    }, 700);

    return () => clearTimeout(timer);
  }, [forceState]);

  return (
    <button
      type="button"
      className={`brain-button brain-button-${state}`}
      onClick={() => runAction()}
      disabled={state === "loading"}
      aria-label={
        state === "loading"
          ? "Generating study plan"
          : state === "success"
            ? "Study plan generated"
            : state === "error"
              ? "Generation failed, try again"
              : "Generate study plan"
      }
    >
      <span className="brain-button-content">
        <span
          className={`button-label ${
            state !== "idle" ? "button-label-hidden" : ""
          }`}
        >
          ✦ Generate Study Plan
        </span>

        <span
          className={`button-state ${
            state !== "loading" ? "button-state-hidden" : ""
          }`}
        >
          <span className="spinner" />
          Generating...
        </span>

        <span
          className={`button-state success-state ${
            state !== "success" ? "button-state-hidden" : ""
          }`}
        >
          <span className="success-icon">✓</span>
          Plan Generated!
        </span>

        <span
          className={`button-state error-state ${
            state !== "error" ? "button-state-hidden" : ""
          }`}
        >
          <span className="error-icon">!</span>
          Try Again
        </span>
      </span>
    </button>
  );
}