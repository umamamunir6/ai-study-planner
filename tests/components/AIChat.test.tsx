import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import AIChat from "../../app/components/AIChat";

const mockSendMessage = vi.fn();
const mockStop = vi.fn();
const mockRegenerate = vi.fn();

let mockChatState: {
  messages: any[];
  status: string;
  error?: Error;
} = {
  messages: [],
  status: "ready",
  error: undefined,
};

vi.mock("@ai-sdk/react", () => ({
  useChat: () => ({
    messages: mockChatState.messages,
    sendMessage: mockSendMessage,
    status: mockChatState.status,
    stop: mockStop,
    error: mockChatState.error,
    regenerate: mockRegenerate,
  }),
}));

describe("AIChat", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockChatState = {
      messages: [],
      status: "ready",
      error: undefined,
    };
  });

  it("renders the AI Study Assistant", () => {
    render(<AIChat />);

    expect(
      screen.getByRole("heading", {
        name: /ai study assistant/i,
      })
    ).toBeInTheDocument();
  });

  it("renders the welcome message when there are no messages", () => {
    render(<AIChat />);

    expect(
      screen.getByText(/how can i help you study/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/explain binary search/i)
    ).toBeInTheDocument();
  });

  it("allows the user to enter a message", () => {
    render(<AIChat />);

    const input = screen.getByPlaceholderText(
      /ask your ai study assistant/i
    );

    fireEvent.change(input, {
      target: {
        value: "Explain merge sort",
      },
    });

    expect(input).toHaveValue("Explain merge sort");
  });

  it("sends a message when the form is submitted", () => {
    render(<AIChat />);

    const input = screen.getByPlaceholderText(
      /ask your ai study assistant/i
    );

    fireEvent.change(input, {
      target: {
        value: "Explain binary search",
      },
    });

    fireEvent.submit(input.closest("form")!);

    expect(mockSendMessage).toHaveBeenCalledWith({
      text: "Explain binary search",
    });
  });

  it("shows the loading state while a response is being submitted", () => {
    mockChatState.status = "submitted";

    render(<AIChat />);

    expect(
      screen.getByText(/ai assistant/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /stop/i,
      })
    ).toBeInTheDocument();
  });

  it("shows the error state when the AI request fails", () => {
    mockChatState.error = new Error("AI request failed");

    render(<AIChat />);

    expect(
      screen.getByText(/couldn't complete that response/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /retry response/i,
      })
    ).toBeInTheDocument();
  });
  it("shows the stop button while the response is streaming", () => {
  mockChatState.status = "streaming";

  render(<AIChat />);

  expect(
    screen.getByRole("button", {
      name: /stop/i,
    })
  ).toBeInTheDocument();
});
});