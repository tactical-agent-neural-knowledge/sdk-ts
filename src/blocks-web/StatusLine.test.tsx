import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { StatusLine } from "./StatusLine.js";

afterEach(cleanup);

describe("StatusLine (web)", () => {
  it("shows TANK's working mark beside the word, as a status a screen reader hears", () => {
    render(<StatusLine word="Neurons firing…" />);
    const line = screen.getByTestId("status-line");
    expect(line.getAttribute("role")).toBe("status");
    expect(line.textContent).toBe("Neurons firing…");
    expect(line.querySelector('[data-mark="doing"]')).not.toBeNull();
  });

  it("gives a new word a new element, so it fades in", () => {
    const { rerender } = render(<StatusLine word="Listening…" />);
    const first = screen.getByText("Listening…");
    rerender(<StatusLine word="Watching…" />);
    expect(screen.queryByText("Listening…")).toBeNull();
    expect(screen.getByText("Watching…")).not.toBe(first);
  });

  it("holds its motion still when reduced motion is asked for, in its own rules", () => {
    render(<StatusLine word="Composing…" />);
    const css = document.getElementById("tank-status-line")?.textContent ?? "";
    expect(css).toContain("prefers-reduced-motion: reduce");
    expect(css).toMatch(/reduce\) \{[^}]*animation: none/);
  });

  it("renders nothing with no word", () => {
    const { container } = render(<StatusLine word="" />);
    expect(container.firstChild).toBeNull();
  });
});
