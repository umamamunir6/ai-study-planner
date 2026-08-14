"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export default function AIChat() {
  const [input, setInput] = useState("");
  const [isNearBottom, setIsNearBottom] = useState(true);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isGenerating = status === "submitted" || status === "streaming";

  /*
   * Check whether the user is currently near the bottom.
   * If they scroll upward, automatic scrolling is released.
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
   * Automatically follow the conversation while the user
   * is already near the bottom.
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

        {/* Header */}
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

        {/* Messages */}
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
                prioritize your subjects, or help with an assignment.
              </p>

              <div className="suggestion-list">
                <button
                  onClick={() =>
                    setInput("Explain binary search in simple words.")
                  }
                >
                  Explain binary search
                </button>

                <button
                  onClick={() =>
                    setInput("Make me a study plan for my exams.")
                  }
                >
                  Make a study plan
                </button>

                <button
                  onClick={() =>
                    setInput("How should I prepare for a difficult exam?")
                  }
                >
                  Exam preparation tips
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
                {message.role === "user" ? "You" : "🤖 AI Assistant"}
              </div>

              <div
                className={`message-bubble ${
                  message.role === "user"
                    ? "user-message"
                    : "assistant-message"
                }`}
              >
                {message.parts.map((part, index) => {
                  if (part.type === "text") {
                    return (
                      <span key={index} className="message-text">
                        {part.text}
                      </span>
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          ))}

          {/* Thinking indicator */}
          {status === "submitted" && (
            <div className="message-row assistant-row">
              <div className="message-label">🤖 AI Assistant</div>

              <div className="message-bubble assistant-message thinking">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>

        {/* Jump to latest */}
        {!isNearBottom && (
          <button
            className="jump-latest"
            onClick={jumpToLatest}
          >
            ↓ Jump to latest
          </button>
        )}

        {/* Input */}
        <form className="ai-input-area" onSubmit={handleSubmit}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your AI study assistant..."
            rows={1}
            disabled={isGenerating}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
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
            >
              ↑
            </button>
          )}
        </form>

        <p className="ai-disclaimer">
          AI responses may occasionally be inaccurate. Verify important information.
        </p>
      </div>
    </div>
  );
}