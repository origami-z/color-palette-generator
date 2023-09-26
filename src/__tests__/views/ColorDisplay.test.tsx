import { expect, test, describe } from "vitest";
import { ColorDisplay } from "../../views/ColorDisplay";
import { render, screen } from "@testing-library/react";

describe("ColorDisplay", () => {
  test("renders", () => {
    const hex = "#FF0000";
    render(<ColorDisplay colorHex={hex} />);
    const textElement = screen.getByText(hex);
    expect(textElement.parentElement?.children[1]).toHaveStyle({
      background: "rgb(255, 0, 0)",
    });
  });
});
