import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, act } from "@testing-library/react";
import AIAssistant from "@/components/ai/AIAssistant";

const scrollToMock = vi.fn();
vi.mock("lenis/react", () => ({
  useLenis: () => ({ scrollTo: scrollToMock }),
}));

beforeEach(() => {
  scrollToMock.mockReset();
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("<AIAssistant /> (REX)", () => {
  it("renders the floating trigger button 'Ask REX'", () => {
    render(<AIAssistant />);
    const triggerBtn = screen.getByRole("button", { name: /open rex ai assistant/i });
    expect(triggerBtn).toBeInTheDocument();
    expect(screen.getByText(/Ask REX/i)).toBeInTheDocument();
  });

  it("opens the chat modal when trigger button is clicked", () => {
    render(<AIAssistant />);
    fireEvent.click(screen.getByRole("button", { name: /open rex ai assistant/i }));

    expect(screen.getByText("REX")).toBeInTheDocument();
    expect(screen.getByText(/AI Agent/i)).toBeInTheDocument();
    expect(screen.getByText(/Greetings! I'm/i)).toBeInTheDocument();
  });

  it("closes the chat modal when the close button is clicked", () => {
    render(<AIAssistant />);
    fireEvent.click(screen.getByRole("button", { name: /open rex ai assistant/i }));
    expect(screen.getByText("REX")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /close rex chat/i }));
    expect(screen.queryByText(/Portfolio Intelligence/i)).not.toBeInTheDocument();
  });

  it("sends a message and responds with knowledge base answer", async () => {
    vi.useFakeTimers();
    render(<AIAssistant />);
    fireEvent.click(screen.getByRole("button", { name: /open rex ai assistant/i }));

    const input = screen.getByPlaceholderText(/Ask REX/i);
    fireEvent.change(input, { target: { value: "Tell me about SafeSync" } });
    fireEvent.submit(input.closest("form")!);

    expect(screen.getByText("Tell me about SafeSync")).toBeInTheDocument();

    // Advance timers inside act to flush React state updates
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.getAllByText(/SafeSync/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/workplace safety/i)).toBeInTheDocument();
  });
});

