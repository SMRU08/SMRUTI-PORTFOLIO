import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CommandPalette from "@/components/ui/CommandPalette";

vi.mock("lenis/react", () => ({
  useLenis: () => ({
    scrollTo: vi.fn(),
  }),
}));

vi.mock("@/lib/sound", () => ({
  isSoundEnabled: vi.fn(() => false),
  setSoundEnabled: vi.fn(),
  playHoverTick: vi.fn(),
  playMechanicalClick: vi.fn(),
}));

describe("<CommandPalette />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("is closed by default", () => {
    render(<CommandPalette />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens when 'open-command-palette' event is dispatched", async () => {
    render(<CommandPalette />);
    act(() => {
      window.dispatchEvent(new CustomEvent("open-command-palette"));
    });

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
    expect(
      screen.getByPlaceholderText(/type a command, project, or skill/i)
    ).toBeInTheDocument();
  });

  it("opens when Ctrl+K is pressed", async () => {
    render(<CommandPalette />);
    act(() => {
      fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    });

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  it("opens when '/' is pressed outside an input", async () => {
    render(<CommandPalette />);
    act(() => {
      fireEvent.keyDown(window, { key: "/" });
    });

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  it("closes when Escape key is pressed", async () => {
    render(<CommandPalette />);
    act(() => {
      window.dispatchEvent(new CustomEvent("open-command-palette"));
    });

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    act(() => {
      fireEvent.keyDown(window, { key: "Escape" });
    });

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });

  it("filters command items when user types in search box", async () => {
    const user = userEvent.setup();
    render(<CommandPalette />);
    act(() => {
      window.dispatchEvent(new CustomEvent("open-command-palette"));
    });

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/type a command, project, or skill/i);
    await user.type(input, "Mars");

    expect(screen.getByText(/Sector 02 \/\/ Mars — JANBHASHA/i)).toBeInTheDocument();
    expect(screen.queryByText(/Sector 01 \/\/ Earth — SafeSync/i)).toBeNull();
  });

  it("shows no results state when query does not match", async () => {
    const user = userEvent.setup();
    render(<CommandPalette />);
    act(() => {
      window.dispatchEvent(new CustomEvent("open-command-palette"));
    });

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/type a command, project, or skill/i);
    await user.type(input, "xyznonexistentgalaxy");

    expect(screen.getByText(/no cosmic signals found/i)).toBeInTheDocument();
  });

  it("executes an item on click and closes the palette", async () => {
    const user = userEvent.setup();
    render(<CommandPalette />);
    act(() => {
      window.dispatchEvent(new CustomEvent("open-command-palette"));
    });

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const item = screen.getByText(/Home \/\/ Top of Galaxy/i);
    await user.click(item);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });
});
