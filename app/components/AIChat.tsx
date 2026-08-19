"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import StudyProgressCard from "./StudyProgressCard";

export default function AIChat() {
  const [input, setInput] = useState("");
  const handleSuggestion = (text: string) => {
  setInput(text);
};
  const [isNearBottom, setIsNearBottom] = useState(true);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, stop, error, regenerate, } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isGenerating =
    status === "submitted" || status === "streaming";

  /*
   * Keep auto-scroll active only while the user
   * is already near the bottom.
   */
  const handleScroll = () => {
    const container = messagesContainerRef.current;

    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    setIsNearBottom(distanceFromBottom < 100);
  };

  /*
   * Follow new streamed content while the user
   * is at the bottom.
   */
  useEffect(() => {
    if (!isNearBottom) return;

    const container = messagesContainerRef.current;

    if (!container) return;

    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });
  }, [messages, isNearBottom]);

  const jumpToLatest = () => {
    const container = messagesContainerRef.current;

    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });

    setIsNearBottom(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedInput = input.trim();

    if (!trimmedInput || isGenerating) return;

    sendMessage({
      text: trimmedInput,
    });

    setInput("");
  };

  return (
    <div className="ai-chat-page">
      <div className="ai-chat-card">

        {/* HEADER */}
        <header className="ai-chat-header">
          <div>
            <h1>🤖 AI Study Assistant</h1>
            <p>Your personal study planning assistant</p>
          </div>

          <div className="ai-status">
            <span className="status-dot"></span>
            Online
          </div>
        </header>

        {/* MESSAGES */}
        <div
          className="ai-messages"
          ref={messagesContainerRef}
          onScroll={handleScroll}
        >
          {messages.length === 0 && (
            <div className="ai-welcome">
              <div className="welcome-icon">✨</div>

              <h2>How can I help you study?</h2>

              <p>
                Ask me to explain a topic, create a study plan,
                check your study progress, or help with an assignment.
              </p>

              <div className="suggestion-list">
                <button
  type="button"
  aria-label="Explain binary search"
  onClick={() =>
    handleSuggestion("Explain binary search in simple words.")
  }
>
                  Explain binary search
                </button>

                <button
    type="button"
    aria-label="Make a study plan"
    onClick={() =>
      handleSuggestion("Make me a study plan for my exams.")
    }
  >
                  Make a study plan
                </button>

                <button
    type="button"
    aria-label="Show my study progress"
    onClick={() =>
      handleSuggestion("Show me my current study progress.")
    }
  >
                  📊 Show my study progress
                </button>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`message-row ${
                message.role === "user"
                  ? "user-row"
                  : "assistant-row"
              }`}
            >
              <div className="message-label">
                {message.role === "user"
                  ? "You"
                  : "🤖 AI Assistant"}
              </div>

              <div
                className={`message-bubble ${
                  message.role === "user"
                    ? "user-message"
                    : "assistant-message"
                }`}
              >
                {message.parts.map((part, index) => {

                  /*
                   * NORMAL STREAMING TEXT
                   */
                  if (part.type === "text") {
                    return (
                      <span
                        key={index}
                        className="message-text"
                      >
                        {part.text}
                      </span>
                    );
                  }

                  /*
                   * FE-07 STUDY PROGRESS TOOL
                   */
                  if (
                    part.type ===
                    "tool-getStudyProgress"
                  ) {

                    /*
                     * STATE 1:
                     * Tool input is still streaming.
                     */
                    if (
                      part.state ===
                      "input-streaming"
                    ) {
                      return (
                        <div
                          key={index}
                          className="tool-card tool-thinking"
                        >
                          <div className="tool-icon">
                            ⚙️
                          </div>

                          <div>
                            <strong>
                              Checking study progress
                            </strong>

                            <p>
                              Preparing the tool request...
                            </p>
                          </div>
                        </div>
                      );
                    }

                    /*
                     * STATE 2:
                     * Tool input is available and
                     * execution is about to happen.
                     */
                    if (
                      part.state ===
                      "input-available"
                    ) {
                      return (
                        <div
                          key={index}
                          className="tool-card tool-running"
                        >
                          <div className="tool-icon">
                            🔍
                          </div>

                          <div>
                            <strong>
                              Checking study progress
                            </strong>

                            <p>
                              Reading your study data...
                            </p>

                            <small>
                              Tool: getStudyProgress
                            </small>
                          </div>
                        </div>
                      );
                    }

                    /*
                     * STATE 3:
                     * Tool successfully returned data.
                     */
                    if (
                      part.state ===
                      "output-available"
                    ) {
                      return (
                        <div key={index}>
                          <div className="tool-success">
                            ✓ Study progress retrieved
                          </div>

                          <StudyProgressCard
                            data={part.output as {
          completedTasks: number;
          totalTasks: number;
          completionRate: number;
          subjects: {
            name: string;
            completed: number;
            total: number;
          }[];
        }}
                          />
                        </div>
                      );
                    }

                    /*
                     * STATE 4:
                     * Tool execution failed.
                     */
                    if (
                      part.state ===
                      "output-error"
                    ) {
                      return (
                        <div
                          key={index}
                          className="tool-card tool-error"
                        >
                          <div className="tool-icon">
                            ⚠️
                          </div>

                          <div>
                            <strong>
                              Couldn't load study progress
                            </strong>

                            <p>
                              {part.errorText ||
                                "The study progress tool failed. Please try again."}
                            </p>
                          </div>
                        </div>
                      );
                    }
                  }

                  return null;
                })}
              </div>
            </div>
          ))}
                    {/* CHAT ERROR */}
          {error && (
  <div className="chat-error-card">
    <div className="chat-error-icon">⚠️</div>

    <div className="chat-error-content">
      <strong>We couldn't complete that response</strong>

      <p>
        The AI service may be temporarily unavailable.
        Your conversation is still here.
      </p>

      <button
        type="button"
        onClick={() => regenerate()}
        className="retry-button"
      >
        ↻ Retry response
      </button>
    </div>
  </div>
)}
          {/* THINKING INDICATOR */}
          {status === "submitted" && (
            <div className="message-row assistant-row">
              <div className="message-label">
                🤖 AI Assistant
              </div>

              <div className="message-bubble assistant-message thinking">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>

        {/* JUMP TO LATEST */}
        {!isNearBottom && (
          <button
            className="jump-latest"
            onClick={jumpToLatest}
          >
            ↓ Jump to latest
          </button>
        )}

        {/* INPUT */}
        <form
          className="ai-input-area"
          onSubmit={handleSubmit}
        >
          <textarea
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            placeholder="Ask your AI study assistant..."
            rows={1}
            disabled={isGenerating}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey
              ) {
                e.preventDefault();

                if (!isGenerating) {
                  handleSubmit(e);
                }
              }
            }}
          />

          {isGenerating ? (
            <button
              type="button"
              className="stop-button"
              onClick={stop}
            >
              ■ Stop
            </button>
          ) : (
            <button
  type="submit"
  className="send-button"
  disabled={!input.trim()}
  aria-label="Send message"
>
  ↑
</button>
          )}
        </form>

        <p className="ai-disclaimer">
          AI responses may occasionally be inaccurate.
          Verify important information.
        </p>
      </div>
    </div>
  );
}