import { expect, test, describe, vi } from "vitest";
import { InputTextArea } from "../../views/InputTextArea";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("InputTextArea", () => {
  test("renders", () => {
    const mockOnHueChange = vi.fn();
    const mockOnSvValuesChange = vi.fn();
    render(
      <InputTextArea
        onHueChange={mockOnHueChange}
        onSvValuesChange={mockOnSvValuesChange}
      />
    );
    screen.getByLabelText("Color values").focus();
    userEvent.paste("#ff0000");
    expect(mockOnHueChange).toBeCalledWith(0);
    expect(mockOnSvValuesChange).toHaveBeenLastCalledWith(
      expect.arrayContaining([{ s: 100, v: 100 }]) // All substring will trigger svValue change, only care the right one at the end
    );
  });
});
