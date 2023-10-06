import { expect, test, describe } from "vitest";
import { ColorDisplay } from "../../views/ColorDisplay";
import { render, screen } from "@testing-library/react";

describe("ColorDisplay", () => {
  test("renders hex color value and background style", () => {
    const hex = "#FF0000";
    render(<ColorDisplay colorHex={hex} />);
    const textElement = screen.getByText(hex);
    expect(textElement.parentElement?.children[1]).toHaveStyle({
      background: "rgb(255, 0, 0)",
    });
  });
  test("renders color in hsv mode", () => {
    const hex = "#FF0000";
    render(<ColorDisplay colorHex={hex} showMode="HSV" />);
    const textElement = screen.getByText("HSV(0, 100, 100)");
    expect(textElement.parentElement?.children[1]).toHaveStyle({
      background: "rgb(255, 0, 0)",
    });
  });
  test("renders trailingText if passed in", () => {
    const hex = "#FF0000";
    render(<ColorDisplay colorHex={hex} trailingText="test" />);
    expect(screen.getByText("test")).toBeInTheDocument();
    const textElement = screen.getByText(hex);
    expect(textElement.parentElement?.children[1]).toHaveStyle({
      background: "rgb(255, 0, 0)",
    });
  });
});
